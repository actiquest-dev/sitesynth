# SiteSynth — Полная техническая архитектура

> Детальный документ: user journey от первого контакта до готового сайта,
> реализация каждого этапа в коде, внешние сервисы, схема компонентов, API.

---

## 1. Полный путь клиента (User Journey)

```
Landing Page (анонимный)
    │  AIChatDrawer — Consultant Agent (presale)
    │  conversation_id создаётся → localStorage['presale_conversation_id']
    ▼
Intake Form (/intake/starter|growth|enterprise)
    │  6 шагов: Service → Complexity → Features → Budget → Contact → Payment
    ▼
Payment (/payment) — Stripe
    │  presale_conversation_id сохраняется в paymentResult
    │  Supabase Auth: createUser(email, tempPassword)
    ▼
Confirmation (/confirmation)
    ▼
Login (/login) — Google OAuth или Email
    │  claimPresaleConversation(email)
    │  → conversations.user_email = email  (анонимный → реальный)
    ▼
Cabinet (/cabinet)
    │
    ├─ Brief Wizard (6 фаз)
    │      upload → description → questions → generating → review → saved
    │      Бриф создаётся с тем же conversation_id
    │
    ├─ Brief Editor + Post-Brief Chat
    │      TipTap WYSIWYG + Design Strategist Agent
    │      Save → Supabase briefs + brief_versions
    │
    ├─ Generate Design Spec
    │      Gemini → JSON структура страниц + UI блоков
    │      Сохраняется в briefs.design_spec_json
    │
    ├─ Figma Build
    │      Architect → Figma Builder Worker (Linux) → Critic → итерации
    │      Управляется через Plugin API или MCP сервер Figma
    │
    └─ Demo Build
           Demo Builder Worker (Linux) → HTML/CSS/JS → /var/www/demo.sitesynth.com
```

---

## 2. Сквозной Conversation ID — реализация

Единый conversation_id создаётся на presale и живёт через все этапы.

### Шаг 1 — Создание (Landing Page, анонимный)

```typescript
// components/AIChatDrawer.vue → initializeConversation()

// Пробуем найти существующий presale conversation
GET /api/chat/conversations?agentType=presale
  header: x-user-email: 'anonymous'
  → Supabase: SELECT * FROM conversations WHERE user_email='anonymous' AND agent_type='presale'
  → ничего нет → создаём новый

POST /api/chat/conversations
  body: { agentType: 'presale', title: 'Consultation - 20.03.2026' }
  → Supabase INSERT: { id: 'conv-uuid-X', user_email: 'anonymous', agent_type: 'presale' }
  → selectedConversationId.value = 'conv-uuid-X'

// *** Сохраняем в localStorage
localStorage.setItem('presale_conversation_id', 'conv-uuid-X')
```

### Шаг 2 — Сохранение при оплате

```typescript
// pages/payment.vue → submitPayment() → при успехе Stripe

const presaleConvId = localStorage.getItem('presale_conversation_id')
if (presaleConvId) sessionData.presale_conversation_id = presaleConvId

localStorage.setItem('paymentResult', JSON.stringify(sessionData))
// sessionData содержит: email, orderId, amount, presale_conversation_id
// Дублируем в paymentResult на случай очистки presale_conversation_id
```

### Шаг 3 — Claim при логине

```typescript
// pages/login.vue → после handleGoogleSignIn() или handleEmailLogin()

const claimPresaleConversation = async (email: string) => {
  // Ищем conversation_id в двух местах (основной + резервный)
  let convId = localStorage.getItem('presale_conversation_id')
  if (!convId) {
    const paymentResult = JSON.parse(localStorage.getItem('paymentResult') || '{}')
    convId = paymentResult.presale_conversation_id || null
  }
  if (!convId) return  // нет presale — пропускаем

  await fetch('/api/conversations/claim', {
    method: 'POST',
    body: JSON.stringify({ conversation_id: convId, user_email: email })
  })

  localStorage.removeItem('presale_conversation_id')  // однократная операция
}
```

```typescript
// server/api/conversations/claim.ts

const { data: conv } = await supabase
  .from('conversations').select('id, user_email').eq('id', conversation_id).single()

// Защита: не клеймить чужой conversation
if (conv.user_email && conv.user_email !== 'anonymous' && conv.user_email !== user_email)
  return { success: true, claimed: false, reason: 'already_owned' }

// Привязываем email к conversation
await supabase.from('conversations')
  .update({ user_email, updated_at: new Date().toISOString() })
  .eq('id', conversation_id)
// Теперь conv-uuid-X принадлежит user@email.com
```

### Шаг 4 — Бриф использует тот же conversation

```typescript
// server/api/briefs/index.ts → POST

let resolvedConversationId = body.conversationId  // передаётся из wizard

if (resolvedConversationId) {
  // Проверяем что conversation принадлежит этому юзеру
  SELECT id FROM conversations WHERE id=? AND user_email=?
  // Обновляем title
  UPDATE conversations SET title=name WHERE id=?
} else {
  // Первый бриф без presale — создаём новый conversation
  INSERT INTO conversations { user_email, agent_type: 'briefing', title }
  resolvedConversationId = новый_id
}

INSERT INTO briefs { user_email, conversation_id: resolvedConversationId, ... }
```

### Шаг 5 — Post-brief chat использует тот же conversation

```typescript
// composables/useChatDrawer.ts
const openPostBrief = (brief: BriefContext) => {
  briefContext.value = brief          // содержит conversationId
  agentMode.value = 'post-brief'
  isOpen.value = true
}

// components/AIChatDrawer.vue → watch agentType
watch(() => props.agentType, async (newVal) => {
  if (newVal === 'post-brief' && props.briefContext?.conversationId) {
    // НЕ создаём новый conversation!
    selectedConversationId.value = props.briefContext.conversationId  // conv-uuid-X
    await loadMessages()           // загружаем всю историю с presale
    await sendProactiveGreeting()  // Design Strategist приветствует
  }
})
```

**Итог:** один тред от первого "Hello" на landing до готового сайта.

---

## 3. Схема компонентов

```
app.vue
├── <NuxtPage />          — текущая страница
├── <AIChatDrawer />      — чат всегда доступен
└── <Toast />             — уведомления

pages/cabinet.vue         — основной кабинет
├── <aside>               — боковая панель
│   ├── Логотип + навигация (Dashboard / Projects)
│   ├── Пользователь: email + аватар
│   └── Log Out
│
├── <header>              — topbar
│   └── Breadcrumb + email
│
└── <main>
    ├── Stats block        — Total Projects, Total Spent, Active Websites
    │
    ├── [selectedBrief == null] → Projects List
    │   ├── "+ New Brief" button → открывает Wizard
    │   └── Brief Cards (grid)
    │       ├── Иконка, название, превью контента (stripped HTML)
    │       └── при hover: Open | ✕
    │
    ├── [selectedBrief != null] → Brief Editor
    │   ├── Topbar: ← Back | [Save] или [Edit] | Delete
    │   ├── Название + даты
    │   ├── Edit mode:
    │   │   ├── <ClientOnly><RichTextEditor v-model="briefEditContent" /></ClientOnly>
    │   │   └── Generate Design Spec / Re-generate Design Spec button
    │   ├── View mode:
    │   │   └── v-html="formatBriefHtml(content)"
    │   └── Design Specification Structure (v-if="designSpec")
    │       └── Grid карточек: страница → список UI блоков
    │
    └── [showBriefWizard] → Wizard (Teleport to body)
        ├── Progress bar (6 шагов)
        ├── [upload]      — file drop zone + Brief Name input
        ├── [description] — textarea описания
        ├── [questions]   — динамический опросник
        ├── [generating]  — spinner
        ├── [review]      — превью + Enhance + Undo
        └── [saved]       — кнопка Finish

components/AIChatDrawer.vue
├── Props: agentType ('presale'|'briefing'|'post-brief'), briefContext, isOpen
├── Header: агент-название + статус
├── Messages list (scroll)
├── Input + Send button
└── Режимы:
    presale   → Consultant Agent
    briefing  → Briefing Assistant (в Wizard)
    post-brief → Design Strategist (после создания брифа)

components/RichTextEditor.vue
├── Toolbar: B I U | H1 H2 H3 | • List 1. List | { } Code " Quote | ↶ ↷
├── <EditorContent :editor="editor" />  — TipTap ProseMirror
├── v-model: получает/отдаёт HTML
├── ClientOnly wrapper (no SSR — ProseMirror требует DOM)
└── watch modelValue → setContent() при внешних изменениях

composables/useChatDrawer.ts
├── isOpen: useState<boolean>
├── agentMode: useState<'presale'|'briefing'|'post-brief'>
├── briefContext: useState<BriefContext | null>
├── openPostBrief(brief) → устанавливает контекст и открывает чат
├── setBriefDraft(draft) → AI предлагает правки в бриф
└── requestBriefDraftApply(draft) → cabinet.vue применяет правки в редактор

composables/useGoogleAuth.ts
├── handleGoogleSignIn(response) → POST /api/auth/google
├── getCurrentUser() → из localStorage['user']
├── logout() → очищает localStorage
└── loadStoredAuth() → восстанавливает сессию при монтировании
```

---

## 4. API — полный список

### Chat
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/chat/conversations` | Список conversations юзера (фильтр по agentType) |
| POST | `/api/chat/conversations` | Создать conversation |
| GET | `/api/chat/messages` | Сообщения conversation по ?conversation_id= |
| POST | `/api/chat/messages` | Отправить сообщение → AI ответ (VoltAgent) |
| POST | `/api/chat/generate-brief` | Генерация брифа из chat context |
| POST | `/api/chat/conversations/intake-summary` | Саммари intake form в conversation |

### Briefs
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/briefs` | Все брифы юзера |
| POST | `/api/briefs` | Создать бриф (с resolvedConversationId логикой) |
| GET | `/api/briefs/:id` | Один бриф |
| PUT | `/api/briefs/:id` | Обновить (content, name → brief_versions) |
| DELETE | `/api/briefs/:id` | Удалить |
| GET | `/api/briefs/:id/versions` | История версий |
| POST | `/api/briefs/generate-spec` | Gemini → design_spec_json |
| POST | `/api/briefs/references/run` | Запустить анализ референсов |
| GET | `/api/briefs/references/status` | Статус анализа |

### Conversations
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/conversations/claim` | Привязать анонимный conversation к email |

### Files
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/files` | Список файлов юзера из Google Drive |
| POST | `/api/files/upload` | Загрузить файл в Drive (server-side stream) |
| GET | `/api/files/get-upload-url` | Resumable upload URL (client-side direct upload) |
| GET | `/api/files/contents` | Текстовый контент файлов для AI |
| POST | `/api/files/ingest` | Индексация файлов для RAG |

### Auth
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/google` | Google JWT → верификация → localStorage |
| POST | `/api/auth/after-payment` | Создать Supabase Auth юзера после оплаты |
| POST | `/api/auth/send-magic-link` | Magic link на email |
| POST | `/api/auth/verify-code` | Проверка кода |
| POST | `/api/auth/recover-order` | Восстановление доступа по email |

### Payment / Orders
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/process-payment` | Stripe charge |
| POST | `/api/create-payment-intent` | Stripe PaymentIntent |
| POST | `/api/webhooks/stripe` | Stripe webhook → обновить orders |
| GET | `/api/orders` | Заказы юзера |
| POST | `/api/orders/save-order` | Сохранить заказ из intake form |
| GET | `/api/user/orders` | Заказы через NocoBase CRM |

### Questionnaire & Brief Generation
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/questionnaire/generate` | Gemini → список вопросов из описания |
| POST | `/api/brief/generate` | Gemini → markdown бриф из ответов + файлов |
| POST | `/api/brief/enhance` | Gemini → улучшение текущего брифа |
| POST | `/api/brief/upload-files` | Загрузка файлов для brief generation |

### Figma Build
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/figma/build` | Запустить Figma build job |
| GET | `/api/figma/build/status` | Статус job + события |
| POST | `/api/figma/build/plan` | Architect Agent → план структуры |
| POST | `/api/figma/build/next` | Следующий шаг сборки |
| POST | `/api/figma/build/critique` | Critic Agent → ревью текущего состояния |
| POST | `/api/figma/build/complete` | Финализировать build |
| POST | `/api/figma/build/event` | Логировать событие от плагина |

### Admin — Figma MCP OAuth
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/admin/figma/mcp/oauth/status` | Статус OAuth интеграции |
| GET | `/api/admin/figma/mcp/oauth/start` | Начать OAuth flow |
| GET | `/api/admin/figma/mcp/oauth/callback` | Callback от Figma |
| POST | `/api/admin/figma/mcp/probe` | Проверить MCP соединение |

### Demo Build
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/demo/build` | Запустить demo build |
| GET | `/api/demo/build/status` | Статус |
| POST | `/api/demo/build/plan` | Планирование структуры |
| POST | `/api/demo/build/next` | Следующий шаг |
| POST | `/api/demo/build/complete` | Завершить |
| POST | `/api/demo/build/event` | Событие от воркера |

### Intake & Documents
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/intake/summarize` | AI саммари intake формы |
| GET | `/api/documents` | Документы проекта |

---

## 5. AI — Агенты и LLM

### VoltAgent Runtime (`server/voltagent/index.ts`)

```
Паттерн: singleton getVoltAgentInstance()
Observability: VoltOps (VOLTAGENT_API_KEY)
  → fire-and-forget fetch, не блокирует serverless
LLM: Gemini через @ai-sdk/google
  Fallback chain: gemini-2.5-pro → gemini-2.0-pro → gemini-1.5-pro
  При 503 (quota) → автоматический retry на следующей модели
```

### Агенты (`server/agents/index.ts`)

```
consultantAgent     — presale консультант
  → systemPrompt: SiteSynth услуги, pricing, убеждает → Intake Form
  → agentType: 'presale'

briefingAgent       — помощник брифа в Wizard
  → systemPrompt: задаёт уточняющие вопросы, структурирует ответы
  → agentType: 'briefing'

architectAgent      — планирует Figma файл
  → вход: design_spec_json + бриф
  → выход: план страниц, компонентов, иерархии

figmaBuilderAgent   — строит компоненты в Figma
  → использует Figma Plugin API или MCP
  → получает план от architect → выполняет пошагово

criticAgent         — ревьюит результат Figma
  → анализирует скриншоты/структуру
  → выдаёт список правок → следующая итерация

referenceStrategistAgent — анализирует референсы
  → читает файлы из Google Drive (референс-сайты, мудборды)
  → выдаёт дизайн-рекомендации

demoBuilderAgent    — создаёт demo сайт
  → вход: design_spec_json + бриф + Figma данные
  → выход: HTML/CSS/JS файлы
```

### Выбор агента в ai-chat.ts

```typescript
const { getAgentForMode } = await import('@/server/agents')
const agent = getAgentForMode(agentType)  // 'presale' | 'briefing' | 'post-brief'

// Workflow поддержка
const workflow = await getActiveWorkflow(conversationId)
const systemPrompt = buildWorkflowSystemPrompt(workflow, agent)

// RAG — поиск по индексированным файлам юзера
const relevantChunks = await retrieveRelevantFileChunks(userEmail, message)

// Вызов агента с историей + контекстом
const response = await callVoltAgent(agent, messages, systemPrompt, relevantChunks)
```

---

## 6. Внешние сервисы — детали

### Supabase (база данных + auth)

```
Регион: eu-central-1
Project ID: wkxwjasgyulakiyclipb

Используется для:
  - Хранение conversations, messages, briefs, orders
  - Auth: createUser после оплаты (supabase.auth.admin.createUser)
  - Service Role Key для всех server-side операций
  - Anon Key для client-side (минимальный доступ)
```

### Google Drive (файловое хранилище)

```
Тип: Google Shared Drive (не personal — нет storage quota проблемы)
Сервисный аккаунт: имеет роль Manager в Shared Drive

Загрузка больших файлов (обход Vercel 4.5MB):
  1. GET /api/files/get-upload-url { filename, mimeType }
     → Drive API initResumable → uploadUrl (действителен 1 неделю)
  2. Клиент: PUT uploadUrl (напрямую в Google, без Vercel)
  3. Любой размер файла — нет ограничений

Загрузка малых файлов:
  POST /api/files/upload
  → Buffer → Readable.from(buffer) → Drive API files.create (stream)
  → Папка: {userEmail}_Files/ в Shared Drive

Чтение для AI:
  GET /api/files/contents { fileIds }
  → Drive API files.get (stream) → текст → в Gemini context
```

### Stripe (платежи)

```
Интеграция:
  POST /api/process-payment → stripe.charges.create
  POST /api/create-payment-intent → stripe.paymentIntents.create (для 3DS)

Webhook:
  POST /api/webhooks/stripe
  → stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
  → charge.succeeded → UPDATE orders SET status='paid', charge_id=...

После оплаты:
  POST /api/email/send-payment-confirmation → Brevo SMTP
  POST /api/auth/after-payment → Supabase Auth createUser
```

### Brevo (email)

```
Транзакционные письма:
  - Подтверждение оплаты
  - Magic link для входа
  - Invoice

API: BREVO_API_KEY
Endpoint: POST https://api.brevo.com/v3/smtp/email
```

### Google OAuth (аутентификация)

```
Google Identity Services SDK (client-side)
components/auth/GoogleSignInButton.vue
  → callback → JWT credential → POST /api/auth/google
  → сервер: OAuth2Client.verifyIdToken(credential)
  → получаем: email, name, picture
  → localStorage: authToken, user { email, name, provider: 'google' }

Все API вызовы передают email через header:
  x-user-email: user@email.com
  (не Supabase JWT сессия — упрощённая авторизация)
```

### Figma — два режима интеграции

**Режим 1: Figma Plugin API (основной для build)**
```
workers/figma-builder.js — Node.js воркер на Linux сервере
  → Читает задания из Supabase figma_build_jobs (polling)
  → Выполняет команды через Figma Desktop Plugin API
  → Логирует события в figma_build_events
  → Cabinet: cabinet.vue polling GET /api/figma/build/status

FIGMA_BUILDER_MODE=plugin — режим когда плагин сам клеймит задания
FIGMA_ACCESS_TOKEN — персональный токен для REST API
```

**Режим 2: Figma MCP (для AI-агентов)**
```
MCP сервер: https://mcp.figma.com/mcp (официальный Figma MCP)
OAuth flow:
  GET /api/admin/figma/mcp/oauth/start
  → PKCE flow → redirect на Figma OAuth
  → GET /api/admin/figma/mcp/oauth/callback
  → сохраняет access_token в Supabase (service_integrations)

MCP-Front прокси (опционально):
  MCP_FRONT_URL + MCP_FRONT_TOKEN
  → проксирует MCP запросы с авторизацией

Figma MCP даёт агентам:
  - Чтение структуры файлов и компонентов
  - Создание/обновление узлов
  - Работа с дизайн-системой
```

### Demo Builder — Linux воркер

```
workers/demo-builder.js — Node.js воркер на Linux сервере
  DEMO_BUILD_API_URL=https://sitesynth-eight.vercel.app/api
  DEMO_BUILD_TOKEN=секретный токен (авторизация воркера)
  DEMO_SITE_ROOT=/var/www/sitesynth/demo.sitesynth.com

Флоу:
  1. Cabinet: POST /api/demo/build → создаёт demo_build_jobs запись
  2. Воркер: polling GET /api/demo/build/next
  3. Воркер: AI генерирует HTML/CSS/JS
  4. Воркер: writeBuildFiles → /var/www/sitesynth/demo.sitesynth.com/{slug}/
  5. Воркер: POST /api/demo/build/complete
  6. Cabinet: показывает preview URL → https://demo.sitesynth.com/{slug}/
```

### NocoBase CRM (внешний)

```
NOCO_BASE_URL=http://your-nocobase-instance.com
NOCO_TOKEN=...

Используется для:
  - GET /api/user/orders → список проектов клиента из CRM
  - GET /api/crm/projects → данные проектов
  - Email login: проверка что email есть в orders

composables/useNocoBase.ts → getList('orders') → фильтрация по email
```

### VoltOps (observability)

```
VOLTAGENT_API_KEY + VOLTAGENT_PROJECT_ID

server/voltagent/index.ts:
  sendLogToVoltOps(logData) — fire-and-forget
  → fetch('https://api.voltagent.dev/logs', ...)
  → не await — не блокирует serverless функцию Vercel

Логируются: все вызовы агентов, ошибки, время ответа
```

---

## 7. Supabase — полная схема таблиц

```sql
conversations
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_email      TEXT    -- 'anonymous' → claim → реальный email
  agent_type      TEXT    -- 'presale' | 'briefing' | 'post-brief'
  title           TEXT
  workflow_id     UUID?
  created_at      TIMESTAMPTZ DEFAULT now()
  updated_at      TIMESTAMPTZ DEFAULT now()

messages
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  conversation_id UUID REFERENCES conversations(id)
  role            TEXT    -- 'user' | 'assistant' | 'system'
  content         TEXT
  agent_type      TEXT?
  created_at      TIMESTAMPTZ DEFAULT now()

briefs
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_email      TEXT
  conversation_id UUID REFERENCES conversations(id)
  agent_type      TEXT    -- 'briefing'
  name            TEXT    -- название проекта (добавлено миграцией)
  brief_data      JSONB   -- { projectName, description, answers, files }
  markdown_content TEXT   -- текст брифа (Markdown / HTML)
  design_spec_json JSONB  -- { pages: [{ title, path, ui_blocks: [...] }] }
  created_at      TIMESTAMPTZ
  updated_at      TIMESTAMPTZ

brief_versions
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  brief_id        UUID REFERENCES briefs(id)
  user_email      TEXT
  version         INTEGER
  name            TEXT
  brief_data      JSONB
  markdown_content TEXT
  source          TEXT    -- 'user-save' | 'ai-enhance' | 'wizard'
  created_at      TIMESTAMPTZ

orders
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_email      TEXT
  full_name       TEXT
  amount          NUMERIC
  currency        TEXT
  payment_method  TEXT
  charge_id       TEXT
  form_data       JSONB   -- все поля intake form
  status          TEXT    -- 'pending' | 'paid' | 'failed'
  order_number    TEXT
  created_at      TIMESTAMPTZ

figma_build_jobs
  id              UUID PRIMARY KEY
  user_email      TEXT
  brief_id        UUID
  status          TEXT    -- 'queued' | 'running' | 'done' | 'failed'
  plan            JSONB
  result          JSONB
  created_at      TIMESTAMPTZ
  updated_at      TIMESTAMPTZ

figma_build_events
  id              UUID PRIMARY KEY
  job_id          UUID REFERENCES figma_build_jobs(id)
  level           TEXT    -- 'info' | 'error' | 'debug'
  message         TEXT
  payload         JSONB
  created_at      TIMESTAMPTZ

demo_build_jobs
  (аналогичная структура figma_build_jobs)

service_integrations
  (Figma MCP OAuth tokens, другие интеграции)

claim_tokens
  (опционально — для claim token flow через URL)
```

---

## 8. Все переменные окружения (Vercel)

```env
# ── Supabase ──────────────────────────────────────
SUPABASE_URL=https://wkxwjasgyulakiyclipb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # только server-side
SUPABASE_ANON_KEY=eyJ...            # public, для client-side

# ── Google Auth ───────────────────────────────────
NUXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
# (используется в composables/useGoogleAuth.ts)

# ── Google Drive ──────────────────────────────────
GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key":"-----BEGIN RSA PRIVATE KEY-----\n...","client_email":"sitesynth-drive@....iam.gserviceaccount.com"}
GOOGLE_SHARED_DRIVE_ID=xxx          # ID Shared Drive (не папки)

# ── Gemini AI ─────────────────────────────────────
GOOGLE_AI_API_KEY=AIza...
# Модели (fallback): gemini-2.5-pro → gemini-2.0-pro → gemini-1.5-pro

# ── Stripe ────────────────────────────────────────
STRIPE_PUBLISHABLE_KEY=pk_live_...  # public
STRIPE_SECRET_KEY=sk_live_...       # server-only
STRIPE_WEBHOOK_SECRET=whsec_...

# ── Brevo (email) ─────────────────────────────────
BREVO_API_KEY=xkeysib-...

# ── NocoBase CRM ──────────────────────────────────
NOCO_BASE_URL=http://your-nocobase-instance.com
NOCO_TOKEN=your_nocobase_api_token

# ── VoltAgent / VoltOps ───────────────────────────
VOLTAGENT_API_KEY=va_...
VOLTAGENT_PROJECT_ID=sitesynth
LOG_LEVEL=info

# ── Figma MCP ─────────────────────────────────────
FIGMA_MCP_URL=https://mcp.figma.com/mcp
FIGMA_ACCESS_TOKEN=figd_...         # персональный токен (fallback)
MCP_FRONT_URL=https://your-mcp-proxy.com   # опционально, прокси
MCP_FRONT_TOKEN=secret

# ── Figma Plugin / Builder ────────────────────────
FIGMA_BUILDER_MODE=plugin           # 'plugin' | 'api'
# На Linux сервере (воркер):
# FIGMA_ACCESS_TOKEN уже выше

# ── Demo Builder (Linux воркер) ───────────────────
DEMO_BUILD_API_URL=https://sitesynth-eight.vercel.app/api
DEMO_BUILD_TOKEN=secret_token       # авторизация воркера
# На Linux сервере (воркер):
DEMO_SITE_ROOT=/var/www/sitesynth/demo.sitesynth.com

# ── App ───────────────────────────────────────────
SITE_URL=https://www.sitesynth.com
NUXT_PUBLIC_SITE_URL=https://www.sitesynth.com
```

---

## 9. Linux сервисы (отдельный сервер)

```
/var/www/sitesynth/
├── demo.sitesynth.com/     — папка для demo сайтов
│   └── {slug}/             — каждый demo в своей папке
│       ├── index.html
│       ├── styles.css
│       └── assets/
│
workers/
├── figma-builder.js        — Node.js воркер Figma Build
│   └── Polling: GET /api/figma/build/next каждые N секунд
│   └── Выполняет: шаги сборки Figma через Plugin API
│   └── Логирует: POST /api/figma/build/event
│
└── demo-builder.js         — Node.js воркер Demo Build
    └── Polling: GET /api/demo/build/next
    └── Генерирует: HTML/CSS/JS через AI
    └── Записывает: в DEMO_SITE_ROOT/{slug}/
    └── Финализирует: POST /api/demo/build/complete

Nginx (или Apache):
  demo.sitesynth.com → /var/www/sitesynth/demo.sitesynth.com/

PM2 / systemd:
  node workers/figma-builder.js  — daemon
  node workers/demo-builder.js   — daemon
```

---

## 10. Deployment

```
Платформа: Vercel
Framework: Nuxt 3 (SSR + Nitro serverless)
Branch: main → auto-deploy Production
Node.js: v22.x
Region: Frankfurt (eu-central-1, близко к Supabase)

Лимиты Vercel и обходы:
  Body 4.5MB      → Resumable Upload URLs для файлов (прямо в Drive)
  Timeout 10-60s  → VoltOps fire-and-forget, длинные задачи в воркерах
  Cold start      → singleton VoltAgent instance

Linux сервер (отдельно от Vercel):
  Figma Builder Worker
  Demo Builder Worker
  Nginx для demo.sitesynth.com
```

---

*Обновлено: Март 2026*
