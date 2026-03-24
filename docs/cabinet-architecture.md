# SiteSynth — Полная техническая архитектура

> Детальный документ: user journey от первого контакта до готового сайта,
> реализация каждого этапа в коде, внешние сервисы, схема компонентов, API.

---

## 1. Полный путь клиента (User Journey)

**Зачем это так устроено:**
SiteSynth — это не просто сайт-визитка, а сервис где AI ведёт клиента от первого
вопроса до готового сайта. Ключевая идея: клиент не заполняет скучные формы,
а разговаривает с AI. Разговор начинается анонимно ещё до регистрации, и мы
не должны терять этот контекст когда клиент платит и регистрируется.
Вся история одного клиента живёт в одном "разговоре" (conversation) — AI всегда
знает с кем говорит и что уже обсуждалось.

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

**Зачем это нужно:**
Самая сложная проблема в AI-сервисах с регистрацией — разрыв контекста.
Клиент поговорил с AI на сайте, потом заплатил и зарегистрировался — и AI
уже не помнит о чём был разговор. Мы решили это через "claim" механизм:
разговор создаётся анонимно, conversation_id сохраняется в localStorage,
а после регистрации привязывается к реальному email. В итоге AI в кабинете
видит с кем разговаривал ещё на presale — что хотел, какой бюджет, какие боли.

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

**Зачем такая структура:**
Кабинет построен как SPA внутри Nuxt. `AIChatDrawer` всегда доступен справа —
клиент может в любой момент уточнить что-то у AI, не прерывая работу с брифом.
`useChatDrawer` — это глобальный state-composable (через `useState` Nuxt),
он позволяет любому компоненту открыть чат и передать контекст без пробрасывания
пропсов через дерево. `RichTextEditor` завёрнут в `<ClientOnly>` потому что
TipTap/ProseMirror работает только в браузере — нет DOM на сервере (SSR).

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

**Зачем REST, а не GraphQL или tRPC:**
Nuxt 3 / Nitro из коробки поддерживает file-based routing для API.
Каждый файл в `server/api/` — это endpoint. Это просто и не требует
дополнительной настройки. Авторизация передаётся через `x-user-email` заголовок
(не JWT сессия) — намеренное упрощение: Supabase Auth используется только
для создания аккаунта после оплаты, а не для каждого API вызова.

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

**Зачем VoltAgent, а не прямые вызовы Gemini:**
VoltAgent даёт observability — видно что агент "думает", какие шаги делает,
где ошибается. Это критично при отладке сложных сценариев (Figma Build с
несколькими итерациями). Также VoltAgent управляет fallback между моделями:
если Gemini 2.5-pro недоступен (quota 503) — автоматически пробует 2.0-pro,
потом 1.5-pro. Клиент не видит ошибок.

**Зачем несколько агентов, а не один:**
Разные задачи требуют разных system prompt'ов. Consultant убеждает купить,
Briefing помогает сформулировать требования, Design Strategist знает что
нужно для дизайн-спеков, Figma Builder знает Plugin API. Один агент со всем
этим контекстом будет "размытым" и менее точным.

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

**Общий принцип выбора сервисов:**
- **Supabase** — Postgres + Auth в одном, бесплатный tier достаточен для старта,
  SQL напрямую без ORM (меньше абстракций = проще дебажить)
- **Google Drive** — клиенты уже используют Google, файлы привычны, Shared Drive
  решает проблему storage quota у service account
- **Stripe** — стандарт для SaaS платежей, excellent webhooks
- **Brevo** — дешевле SendGrid, простой API для транзакционных писем
- **VoltOps** — часть VoltAgent экосистемы, zero config для observability
- **Linux воркеры** — Vercel serverless имеет лимит 60s на функцию, длинные
  AI задачи (Figma build, demo build) требуют постоянного процесса

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

**Зачем Drive, а не S3 или Supabase Storage:**
Клиенты загружают референсы, логотипы, брендбуки — это файлы которые они
хотят видеть в привычном интерфейсе, не в "бакете". Google Drive даёт
им доступ к своим файлам напрямую. Shared Drive решает главную проблему
Service Account — у него нет personal storage quota, только Shared Drive
даёт реальное место для хранения.

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

**Зачем два режима (Plugin API и MCP):**
Figma Plugin API — это "старый" способ: плагин запускается в Figma Desktop
и выполняет команды локально. Надёжно, но требует Figma Desktop на Linux сервере.
Figma MCP — новый официальный протокол (2025), даёт AI-агентам прямой
доступ к файлам через стандартный Model Context Protocol. MCP позволяет агентам
"читать" и "писать" в Figma без плагина. Мы поддерживаем оба режима пока
MCP не стал стабильным.

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

**Зачем отдельный Linux сервер, а не Vercel:**
Demo Build — это длинная задача: AI генерирует код, записывает файлы на диск,
поднимает preview. Vercel serverless функция живёт максимум 60 секунд.
Linux воркер — постоянный Node.js процесс (PM2/systemd) который polling'ует
задания из Supabase, выполняет их без ограничений по времени и пишет файлы
в `/var/www/demo.sitesynth.com/{slug}/` который Nginx отдаёт клиенту.

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

**Зачем такая структура:**
`conversations` — центральная таблица, один тред = один клиентский путь.
`briefs` — привязан к conversation, хранит markdown (редактируемый) и
design_spec_json (генерируемый). `brief_versions` — история изменений,
позволяет откатиться если AI "улучшил" не так. `orders` — данные из intake
form, независимы от briefs (заказ может быть без брифа на начальном этапе).
`figma_build_jobs/events` — job queue + event log для асинхронного Figma Build.

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

**Как работает конфигурация:**
Vercel читает env vars из Dashboard → Settings → Environment Variables.
Nuxt 3 разделяет их на две группы: `runtimeConfig` (только server) и
`runtimeConfig.public` (доступны на клиенте). Переменные с префиксом
`NUXT_PUBLIC_` автоматически попадают в public. Всё остальное — server-only.
`.env.local` используется только для локальной разработки, никогда не коммитится.

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

## 9. Oracle Linux сервер — полная инфраструктура

**Зачем отдельный сервер, а не только Vercel:**
Vercel — serverless платформа: максимум 60 секунд на функцию, нельзя писать
файлы на диск, нет постоянных процессов. Задачи типа "собери Figma макет",
"сделай скриншоты 10 конкурентов", "собери demo-сайт и задеплой" занимают
минуты и требуют файловой системы. Oracle ARM сервер (aarch64, Ubuntu 22.04)
решает это: постоянные systemd-сервисы, файловая система, Node.js без лимитов.
Vercel не знает о сервере — воркеры сами polling'уют Vercel API.

```
Хост:  ubuntu@138.2.134.17  (Oracle Cloud, ARM aarch64)
OS:    Ubuntu 22.04 LTS
SSH:   .ssh/codex_sitesynth  (ключ в репо, не в git)
```

### Запущенные сервисы (systemd)

```
demo-builder.service       — Node.js, polling Vercel API, пишет demo сайты
  ExecStart: /usr/bin/node /home/ubuntu/sitesynth/workers/demo-builder.js
  EnvironmentFile: /etc/sitesynth/demo-builder.env
  Status: active ✅

figma-builder.service      — Node.js, polling Vercel API, запускает Figma Build
  ExecStart: /usr/bin/node /home/ubuntu/sitesynth/workers/figma-builder.js
  EnvironmentFile: /etc/sitesynth/figma-builder.env

reference-capture.service  — Node.js, скриншоты через headless Chromium, порт 8890
  ExecStart: npm start → node server.js  (в /home/ubuntu/reference-capture/)
  EnvironmentFile: /etc/sitesynth/reference-capture.env
  Status: active ✅

mcp-front.service          — Go-бинарник, прокси Figma MCP, порт 8888
  ExecStart: /home/ubuntu/mcp-front/mcp-front-linux -config /etc/sitesynth/mcp-front.json
  EnvironmentFile: /etc/sitesynth/mcp-front.env
  Status: active ✅

xvfb.service               — виртуальный X11 дисплей (для GUI Chrome если нужен)
x11vnc.service             — VNC сервер поверх Xvfb, порт 5900
novnc.service              — noVNC web интерфейс, порт 6080
  → https://mcp.sitesynth.com/vnc/  (браузер к VNC)

nginx.service              — веб-сервер, 80/443
```

### Директории на сервере

```
/home/ubuntu/
├── sitesynth/                   — клон репозитория (Mar 21, workers обновляются вручную)
│   └── workers/
│       ├── demo-builder.js      — основной воркер Demo Build
│       └── figma-builder.js     — воркер Figma Build
│
├── reference-capture/           — сервис скриншотов (отдельный проект)
│   ├── server.js                — HTTP сервер на Puppeteer + headless Chromium
│   ├── package.json
│   └── storage/                 — временные файлы (до загрузки в Drive)
│
├── mcp-front/                   — MCP-Front прокси (Go)
│   ├── mcp-front                — Linux ARM64 бинарник (рабочий)
│   ├── mcp-front-linux          — симлинк → mcp-front (нужен для systemd)
│   └── bin/mcp-front            — macOS бинарник (не работает на Linux!)
│
├── design-references/           — хранилище скриншотов для Nginx
│   └── {briefId}/{competitor}/  — PNG файлы по структуре
│
└── .claude/                     — Claude Code (установлен на сервере)
    └── .credentials.json

/var/www/sitesynth/
└── demo.sitesynth.com/          — папка для demo сайтов (создана Mar 24)
    └── {slug}/
        ├── index.html
        ├── styles.css
        └── assets/

/etc/sitesynth/                  — конфиги сервисов (root-owned)
├── demo-builder.env
├── figma-builder.env
├── reference-capture.env
├── mcp-front.env
└── mcp-front.json               — конфиг MCP-Front (серверы, OAuth)
```

### Nginx — сайты

```
demo.sitesynth.com (443 HTTPS):
  root → /var/www/sitesynth/demo.sitesynth.com/
  try_files $uri $uri/ $uri/index.html =404
  SSL: /etc/nginx/ssl-certificates/demo.sitesynth.com.{crt,key}

mcp.sitesynth.com (443 HTTPS):
  / → proxy_pass http://127.0.0.1:8888     (mcp-front)
  /vnc/ → proxy_pass http://127.0.0.1:6080  (noVNC WebSocket)
  /design_references/ → alias /home/ubuntu/design-references/  (CDN для скриншотов)
  /reference_capture/ → proxy_pass http://127.0.0.1:8890      (capture API)
  SSL: /etc/nginx/ssl-certificates/mcp.sitesynth.com.{crt,key}
```

### Конфиги сервисов (/etc/sitesynth/)

```bash
# demo-builder.env
DEMO_BUILD_API_URL=https://sitesynth-eight.vercel.app/api
DEMO_BUILD_TOKEN=c4964e0d...                     # авторизация воркера в Vercel API
DEMO_SITE_ROOT=/var/www/sitesynth/demo.sitesynth.com

# reference-capture.env
REFERENCE_CAPTURE_PORT=8890
REFERENCE_CAPTURE_HOST=127.0.0.1
REFERENCE_CAPTURE_TOKEN=7b7a8583...
REFERENCE_CAPTURE_STORAGE_ROOT=/home/ubuntu/design-references
REFERENCE_CAPTURE_PUBLIC_BASE_URL=https://mcp.sitesynth.com/design_references
CHROMIUM_PATH=/usr/bin/chromium-browser

# mcp-front.env (без секретов)
MCP_FRONT_ADDR=:8888
MCP_FRONT_BASE_URL=http://138.2.134.17:8888
MCP_FRONT_LOG_LEVEL=info
OAUTH_ISSUER=https://mcp.sitesynth.com
GITHUB_CLIENT_ID=Ov23lioVOX9kvR3l8gYE
GITHUB_REDIRECT_URI=https://mcp.sitesynth.com/oauth/callback
SUPABASE_URL=https://wkxwjasgyulakiyclipb.supabase.co
FIGMA_MCP_URL=http://127.0.0.1:8888/figma/sse
```

### MCP-Front — конфиг серверов (mcp-front.json)

```json
{
  "mcpServers": {
    "figma": {
      "transportType": "streamable-http",
      "url": "https://mcp.figma.com/mcp",
      "headers": { "Authorization": "$env:FIGMA_MCP_ACCESS_TOKEN" },
      "serviceAuths": [{ "type": "bearer", "tokens": ["WFxMEMS..."] }]
    },
    "anthropic": {
      "requiresUserToken": true,
      "userAuthentication": { "type": "manual", "displayName": "Claude" }
    },
    "openai": {
      "requiresUserToken": true,
      "userAuthentication": { "type": "manual", "displayName": "OpenAI" }
    }
  }
}
```

**Зачем MCP-Front:**
Figma MCP (`mcp.figma.com/mcp`) требует OAuth токен. MCP-Front — это Go-прокси
который хранит токены и добавляет их к запросам. Агент не знает токен,
он просто говорит с MCP-Front который уже авторизован в Figma.
MCP-Front поддерживает OAuth через GitHub для аутентификации пользователей
(если нужен web-интерфейс управления интеграциями).

### Reference Capture Service (порт 8890)

```javascript
// /home/ubuntu/reference-capture/server.js
// Node.js HTTP сервер на Puppeteer + headless Chromium

POST /capture
  body: { briefId, competitor, pages: [{url, kind, label, viewport?}] }
  → launchBrowser() — headless Chromium (CHROMIUM_PATH=/usr/bin/chromium-browser)
  → для каждой страницы:
      page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
      page.screenshot({ fullPage: true, type: 'png' })
      viewports: desktop (1440×2200) + mobile (430×1800)
  → файлы: /home/ubuntu/design-references/{briefId}/{competitor}/{slug}-{suffix}.png
  → publicUrl: https://mcp.sitesynth.com/design_references/{briefId}/{competitor}/...
  → response: { success: true, data: { assets: [...] } }

GET /health → { status: 'ok' }

Авторизация: Bearer token из REFERENCE_CAPTURE_TOKEN
```

**Зачем headless Chromium а не обычный fetch:**
Многие сайты-конкуренты используют JavaScript-рендеринг, lazy loading,
CSS анимации. Простой HTTP запрос получит пустую страницу. Chromium
полностью рендерит страницу включая JS, ждёт networkidle2 (нет сетевой
активности 500мс) — скриншот соответствует тому что видит реальный пользователь.

### Обновление кода на сервере

```bash
# Воркеры обновляются копированием через scp (не git pull — разные версии)
scp -i .ssh/codex_sitesynth workers/demo-builder.js ubuntu@138.2.134.17:/home/ubuntu/sitesynth/workers/
scp -i .ssh/codex_sitesynth workers/figma-builder.js ubuntu@138.2.134.17:/home/ubuntu/sitesynth/workers/

# После обновления воркера — перезапуск
ssh -i .ssh/codex_sitesynth ubuntu@138.2.134.17 "sudo systemctl restart demo-builder"
```

---

## 10. Две ветки производства — Figma vs Demo Site

**Зачем две ветки:**
После создания брифа и дизайн-спека система расходится на два независимых потока.
Figma-ветка — для клиентов которым нужны профессиональные исходники для дизайнера.
Demo-ветка — живой HTML/CSS/JS сайт который можно открыть в браузере прямо сейчас.
Оба потока работают через job queues в Supabase, выполняются на Oracle сервере,
не мешают друг другу.

```
Brief + Design Spec (design_spec_json)
        │
        ├──────────────────────────────────────────────────────────┐
        │                                                          │
        ▼                                                          ▼
[ВЕТКА 1 — FIGMA]                                    [ВЕТКА 2 — DEMO SITE]
        │                                                          │
POST /api/figma/build                          POST /api/demo/build
  → INSERT figma_build_jobs                     → INSERT demo_build_jobs
    status='queued'                               status='queued'
    spec_snapshot={designSpec, buildPlan}         spec_snapshot={designSpec}
        │                                                          │
        ▼                                                          ▼
figma-builder.js                               demo-builder.js
  polling GET /api/figma/build/next              polling GET /api/demo/build/next
        │                                                          │
        ▼                                                          ▼
architectAgent (VoltAgent)                     POST /api/demo/build/plan
  → UX структура: страницы, секции               → demoBuilderAgent (VoltAgent)
        │                                         → generateObject: {title,slug,html,css,notes}
        ▼                                                          │
figmaBuilderAgent (VoltAgent)                                      ▼
  → JSON список команд Figma:                  writeBuildFiles(slug, html, css)
    create_page, create_frame,                 → /var/www/sitesynth/demo.sitesynth.com/{slug}/
    create_component, set_fill...                    index.html + styles.css + assets/
        │                                                          │
        ├── FIGMA_BUILDER_MODE=plugin                              ▼
        │       → Figma Desktop Plugin API         POST /api/demo/build/complete
        │                                          → demo_build_jobs.status='done'
        └── FIGMA_BUILDER_MODE=api                 → demo_build_jobs.result_url
                → MCP-Front (:8888)           https://demo.sitesynth.com/{slug}/
                → mcp.figma.com/mcp                     (Nginx → папка на диске)
                → generate_figma_design tool
                → Figma file URL
        │
        ▼
criticAgent (VoltAgent)
  → анализирует результат 0-5
  → если < 3 → итерация (следующий шаг)
  → если ≥ 3 → figma_build_jobs.status='done'
```

### Ветка Demo — детали demoBuilderAgent

```typescript
// server/api/demo/build/plan.ts
// Вызывается воркером: POST /api/demo/build/plan { token, jobId }

const job = await db.from('demo_build_jobs').select(...).eq('id', jobId).single()
const spec = job.spec_snapshot  // design_spec_json + brief content

const result = await demoBuilderAgent.generateObject(prompt, schema)
// Агент возвращает строго:
// { title, slug, html: '<!DOCTYPE html>...', css: '...', notes: '...' }

await db.from('demo_build_jobs').update({ output: result }).eq('id', jobId)
// → воркер читает output.html и output.css → пишет файлы на диск
```

### Ветка Figma — MCP-Front схема

```
figma-builder.js на Oracle
        │
        └── callMcpFront('figma', { method: 'tools/call',
              params: { name: 'generate_figma_design', arguments: { commands } }
            })
                │
                ▼
        http://127.0.0.1:8888   (mcp-front, localhost)
                │   добавляет Authorization: Bearer <FIGMA_MCP_ACCESS_TOKEN>
                ▼
        https://mcp.figma.com/mcp
                │
                ▼
        Figma File (создаётся/редактируется)
```

---

## 11. Reference Research Pipeline

**Зачем анализ референсов перед дизайном:**
Если AI генерирует дизайн-спек без изучения конкурентов — результат усреднённый.
Если до генерации спека AI изучил 5-10 реальных конкурентов (скриншоты homepage,
pricing, about), увидел их navigation patterns, CTA-treatments, color palettes —
итоговый дизайн конкурентно обоснован. Результат встраивается прямо в бриф
как раздел "Competitive Landscape".

```
Бриф (markdown_content)
        │
POST /api/briefs/references/run    [server/api/briefs/references/run.post.ts]
  header: x-user-email
  body:   { briefId }
        │
        ▼
runReferenceAnalysisPipeline()     [server/utils/reference-research.ts]
        │
        ├─ 1. discoverReferences(markdownContent)
        │      │
        │      ├─ Gemini generateObject → competitorSchema
        │      │    → product_type, surface_type
        │      │    → market_tags[], style_tags[]
        │      │    → search_queries[], competitor_names[]
        │      │
        │      ├─ selectCuratedReferenceShortlist()
        │      │    [server/utils/curated-reference-library.ts]
        │      │    → векторный поиск по кураторской библиотеке
        │      │    → релевантные референсы с оценкой совпадения
        │      │
        │      └─ searchDuckDuckGo(query) × N запросов
        │           → парсинг HTML (result__a links)
        │           → дедупликация → топ 10 URL
        │
        ├─ 2. callCaptureService({ briefId, competitor, pages })
        │      │
        │      │  POST http://127.0.0.1:8890/capture   (Oracle сервер)
        │      │  Bearer: REFERENCE_CAPTURE_TOKEN
        │      │
        │      ▼
        │   reference-capture (Node.js + headless Chromium)
        │      → page.goto(url, { waitUntil: 'networkidle2' })
        │      → screenshot desktop (1440px) + mobile (430px)
        │      → PNG → /home/ubuntu/design-references/{briefId}/{competitor}/
        │      → publicUrl: https://mcp.sitesynth.com/design_references/...
        │
        ├─ 3. uploadScreenshotToDrive({ userEmail, briefId, competitor, asset })
        │      → Google Drive: UserRoot / Brief_{id} / Competitor_References / {name} /
        │      → driveFileId + driveUrl (для клиента)
        │
        ├─ 4. analyzeAsset(asset)
        │      → Gemini Vision (gemini-2.5-pro) смотрит на PNG:
        │        page purpose, section order, nav pattern, card layout,
        │        CTA treatment, typography mood, density, strengths, weaknesses
        │      → analysis_json → brief_reference_assets.analysis_json
        │
        ├─ 5. buildReferenceSummary(markdownContent, assets)
        │      → referenceStrategistAgent (VoltAgent) или Gemini fallback
        │      → referenceSummarySchema:
        │        recommended_direction, style_keywords[], market_patterns[],
        │        opportunities_to_differentiate[], recommended_references[],
        │        do[], avoid[]
        │
        └─ 6. mergeReferenceSectionIntoBrief(content, summary, assets)
               → вставляет <!-- REFERENCE_ANALYSIS_START/END --> в markdown
               ## Competitive Landscape
               ### Selected References     (ссылки на сайты конкурентов)
               ### Reference Screenshots   (publicUrl скриншотов)
               ### Recommended Visual Direction  (do / avoid)
               → UPDATE briefs SET markdown_content, reference_analysis_json,
                   reference_status='completed', reference_completed_at=now()
```

### Таблица brief_reference_assets

```sql
CREATE TABLE brief_reference_assets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id        UUID REFERENCES briefs(id),
  source_url      TEXT,       -- исходный URL конкурента
  final_url       TEXT,       -- после редиректов
  competitor      TEXT,       -- hostname (напр. 'stripe')
  page_kind       TEXT,       -- 'homepage' | 'pricing' | 'about'
  viewport        TEXT,       -- 'desktop' | 'mobile'
  title           TEXT,       -- заголовок страницы
  public_url      TEXT,       -- https://mcp.sitesynth.com/design_references/...
  local_path      TEXT,       -- имя PNG файла
  drive_file_id   TEXT,       -- Google Drive file ID
  drive_url       TEXT,       -- Google Drive view link
  analysis_json   JSONB,      -- Gemini Vision анализ
  selected        BOOLEAN,    -- включён в финальный отчёт
  updated_at      TIMESTAMPTZ
);
```

---

## 12. Целевой Production Pipeline (полная цепочка)

**Концепция: разделение "думать" и "делать"**
VoltAgents думают — анализируют, планируют, формируют контракты.
Executor (Cline или воркер) делает — берёт контракт, пишет файлы,
запускает сборку, исправляет ошибки. Это разделение важно:
Gemini хорош в мультимодальном дизайн-анализе, плох в итеративной
починке кода. Cline наоборот — идеальный исполнитель.

```
Стадия 1: BRIEFING AGENT
  briefingAgent (VoltAgent) ведёт клиента в кабинете
  → структурирует: цели, аудиторию, pages, jobs-to-be-done, constraints
  → результат: briefs.markdown_content (Markdown/HTML)
             + briefs.brief_data (JSONB: projectName, answers, files)

Стадия 2: REFERENCE STRATEGIST AGENT
  referenceStrategistAgent (VoltAgent) + reference-capture (Oracle)
  → берёт бриф → анализирует competitor URLs → скриншоты
  → формирует: UX-паттерны, визуальные паттерны, anti-patterns
  → результат: briefs.reference_analysis_json
             + brief_reference_assets (скриншоты + Gemini Vision анализ)
             + раздел "Competitive Landscape" в бриф

Стадия 3: DESIGN AGENT (Gemini Multimodal)
  Gemini (gemini-2.5-pro) в /api/briefs/generate-spec
  → получает: бриф + reference_analysis_json + клиентские файлы (Drive)
  → делает: layout logic, visual direction, token system,
            component inventory, image needs
  → результат: briefs.design_spec_json
    {
      pages: [{ title, path, sections: [{ type, blocks: [...] }] }],
      design_tokens: { colors, typography, spacing, radius },
      components: [...],
      asset_requirements: [...]
    }

Стадия 4: ASSET AGENT  [планируется]
  → читает design_spec_json.asset_requirements
  → генерит или подбирает изображения
  → прогоняет через resize/format pipeline
  → результат: asset_manifest.json (path → publicUrl)

Стадия 5: BUILD ORCHESTRATOR
  /api/demo/build → INSERT demo_build_jobs
  → собирает единый build package (spec_snapshot):
    { brief, reference_report, design_spec, asset_manifest, slug, target_path }

Стадия 6: EXECUTOR на Oracle
  demo-builder.js (сейчас) — простой воркер: берёт html/css → пишет файлы
  Cline headless (целевое) — итеративный исполнитель:
    → читает build_job.json (жёсткий контракт)
    → scaffold project в workspace
    → пишет/правит файлы
    → npm install && npm run build
    → исправляет ошибки в 1-N итерациях
    → committed files summary

Стадия 7: VERIFICATION  [планируется]
  → smoke checks (статус 200)
  → link checks (нет битых ссылок)
  → visual screenshot checks (Chromium)
  → если критично сломано → executor ещё итерация

Стадия 8: PUBLISH
  → файлы в /var/www/sitesynth/demo.sitesynth.com/{slug}/
  → POST /api/demo/build/complete { token, jobId, url }
  → cabinet показывает: status='done', url, preview screenshot
  → https://demo.sitesynth.com/{slug}/
```

### Build Job Contract (build_job.json)

```json
{
  "project": {
    "name": "Acme SaaS",
    "slug": "acme-saas",
    "target_url": "https://demo.sitesynth.com/acme-saas/"
  },
  "implementation_mode": {
    "framework": "static-html",
    "workspace": "/var/www/sitesynth/demo.sitesynth.com/acme-saas"
  },
  "pages": [
    {
      "id": "home",
      "path": "/",
      "sections": ["hero", "logos", "features", "pricing", "faq", "cta"]
    }
  ],
  "design_tokens": {
    "colors": { "primary": "#0F0F0F", "accent": "#7C3AED" },
    "typography": { "heading": "Inter", "body": "Inter" },
    "spacing": { "section": "120px", "card-gap": "24px" },
    "radius": { "card": "12px", "button": "8px" }
  },
  "components": [
    { "id": "hero", "type": "hero-centered", "headline": "...", "cta": "..." }
  ],
  "assets": [
    { "id": "hero-bg", "type": "image", "url": "https://mcp.sitesynth.com/design_references/..." }
  ],
  "rules": [
    "Responsive first — mobile breakpoint 430px",
    "No lorem ipsum — use real content from brief",
    "Semantic HTML5",
    "Use provided design tokens exactly",
    "No external CDN dependencies — inline or bundle"
  ]
}
```

**Почему Cline получает контракт, а не сырой бриф:**
Cline хорош в реализации и итеративной починке кода. Плохой вход для него —
10 скриншотов мудбордов и размытые пожелания. Поэтому мультимодальный анализ
(стадии 2-3) и дизайн-стратегия должны быть ДО Cline. Cline получает точный
JSON-контракт — ему не нужно думать о дизайне, только реализовывать.

### Минимальный production pipeline (сейчас работает)

```
Briefing Agent    ✅ — briefingAgent, TipTap editor
Reference Agent   ✅ — referenceStrategistAgent + reference-capture на Oracle
Design Spec       ✅ — Gemini /api/briefs/generate-spec → design_spec_json
Demo Builder      ✅ — demoBuilderAgent + demo-builder.js + nginx + demo.sitesynth.com
```

### Что планируется добавить

```
Asset Agent           — генерация/подбор изображений под design_contract
build_job.json        — стандартизированный контракт между агентами
Cline Executor        — headless Cline на Oracle вместо простого воркера
Verification Layer    — smoke + link + visual checks
Critique Loop         — criticAgent по скриншоту demo → итерация
Figma Build           — figma-builder.js + MCP-Front → Figma file
```

---

## 13. Deployment

**Зачем Vercel, а не собственный сервер для Nuxt:**
Vercel даёт автодеплой из git, CDN, edge network, preview deployments —
всё без настройки. Nuxt 3 имеет first-class поддержку Vercel через Nitro preset.
Ограничения Vercel решаются Oracle воркерами для длинных задач.

```
Платформа: Vercel
Framework: Nuxt 3 (SSR + Nitro serverless)
Branch: main → auto-deploy Production
Node.js: v22.x
Region: Frankfurt (eu-central-1)

Лимиты Vercel и обходы:
  Body 4.5MB      → Resumable Upload URLs → напрямую в Google Drive
  Timeout 10-60s  → fire-and-forget VoltOps, длинные задачи в воркерах Oracle
  Нет файловой системы → Oracle: /var/www/sitesynth/demo.sitesynth.com/
  Cold start      → singleton VoltAgent instance (getVoltAgentInstance)

Oracle Linux сервер (138.2.134.17):
  demo-builder.service     — Demo Build Worker
  figma-builder.service    — Figma Build Worker
  reference-capture        — Screenshot Service (headless Chromium :8890)
  mcp-front                — MCP Proxy для Figma (:8888)
  nginx                    — demo.sitesynth.com + mcp.sitesynth.com
```
воркерами, и не блокируют друг друга.

```
Brief + Design Spec
        │
        ├───────────────────────────────────────────────┐
        │                                               │
        ▼                                               ▼
[ВЕТКА 1 — FIGMA]                          [ВЕТКА 2 — DEMO SITE]
        │                                               │
POST /api/figma/build               POST /api/demo/build
        │                                               │
INSERT figma_build_jobs             INSERT demo_build_jobs
  status: 'pending'                   status: 'pending'
  spec_snapshot: {...}                spec_snapshot: {...}
        │                                               │
        ▼                                               ▼
figma-builder.js (Linux)            demo-builder.js (Linux)
  polling /api/figma/build/next       polling /api/demo/build/next
        │                                               │
        ▼                                               ▼
architectAgent                      demoBuilderAgent (Gemini)
  → UX структура страниц              → HTML + CSS + JS
        │                                               │
        ▼                                               ▼
figmaBuilderAgent                   POST /api/demo/build/plan
  → JSON команды Figma                     │
  (create_page, create_frame,              ▼
   create_component, set_fill...)   writeBuildFiles(slug, html, css)
        │                                               │
        ├── plugin mode                                 ▼
        │   Figma Desktop App        /var/www/sitesynth/
        │   (Plugin API)             demo.sitesynth.com/{slug}/
        │                                               │
        └── api mode                                    ▼
            MCP-Front (Linux)       https://demo.sitesynth.com/{slug}/
            → mcp.figma.com/mcp     (Nginx на Linux сервере)
            → Figma File URL
```

### Ветка 1 — Figma: детали

**Зачем через MCP, а не напрямую через Figma REST API:**
Figma REST API позволяет только читать файлы. Для создания и редактирования
нужен либо Figma Desktop Plugin (через Plugin API), либо официальный MCP сервер
Figma (`mcp.figma.com`) — он даёт AI-контроль над Figma через JSON-RPC
с OAuth авторизацией. **MCP-Front работает на Linux сервере** — это прокси
который добавляет OAuth токен из таблицы `service_integrations` и проксирует
запросы к `mcp.figma.com/mcp`.

```typescript
// workers/figma-builder.js

// 1. Получаем задание
const next = await apiGet(`/api/figma/build/next?token=${TOKEN}`)
// → { jobId, specSnapshot: { designSpec, buildPlan } }

// 2. architectAgent → UX структура страниц

// 3. figmaBuilderAgent → JSON команды:
// [
//   { command: "create_page", name: "Home" },
//   { command: "create_frame", page: "Home", name: "Hero", w: 1440, h: 900 },
//   { command: "create_component", frame: "Hero", type: "heading", text: "..." },
//   { command: "set_fill", target: "Hero", color: "#0F0F0F" },
// ]

// 4a. FIGMA_BUILDER_MODE=plugin → Figma Desktop Plugin
// 4b. FIGMA_BUILDER_MODE=api   → MCP-Front (Linux) → mcp.figma.com
async function callMcpFront(service, body) {
  return fetch(`${MCP_FRONT_URL}/${service}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MCP_FRONT_TOKEN}` },
    body: JSON.stringify(body),
  }).then(r => r.json())
}

await callMcpFront('figma', {
  method: 'tools/call',
  params: { name: 'generate_figma_design', arguments: { commands } }
})

// 5. criticAgent (0-5) — если < 3, итерация
// 6. Figma URL → figma_build_jobs.result_url
```

### Ветка 2 — Demo Site: детали

**Зачем demo, если есть Figma:**
Demo — это живой сайт в браузере прямо сейчас. Figma — исходник для дизайнера.
Demo показывает клиенту "вот твой сайт" до финальной разработки.

```typescript
// workers/demo-builder.js

const next = await apiGet(`/api/demo/build/next?token=${TOKEN}`)
// → { jobId, slug }

const plan = await apiPost('/api/demo/build/plan', { token: TOKEN, jobId })
// → { html, css, assets: [{ path, data_base64 }] }

// Пишем файлы на диск Linux сервера
const targetDir = path.join(SITE_ROOT, slug)  // /var/www/sitesynth/demo.../slug/
await fs.writeFile(path.join(targetDir, 'index.html'), html)
await fs.writeFile(path.join(targetDir, 'styles.css'), css)
// assets: base64 → Buffer → бинарные файлы

// Nginx автоматически раздаёт папку → https://demo.sitesynth.com/{slug}/
```

---

## 11. Reference Research Pipeline — Референсы и скриншоты

**Зачем это нужно:**
Перед генерацией дизайн-спека AI изучает реальных конкурентов клиента —
скриншоты их сайтов, навигацию, цветовые схемы, CTA. Это делает итоговый
дизайн конкурентно обоснованным, а не усреднённым. Раздел "Competitive Landscape"
встраивается прямо в текст брифа и используется при генерации дизайн-спека.

```
POST /api/briefs/references/run
        │
runReferenceAnalysisPipeline()        [server/utils/reference-research.ts]
        │
        ├─ 1. discoverReferences()    — кто конкуренты?
        │      │
        │      ├─ Gemini generateObject → competitorSchema
        │      │    product_type, surface_type, market_tags, style_tags,
        │      │    search_queries, competitor_names
        │      │
        │      ├─ selectCuratedReferenceShortlist()
        │      │    [server/utils/curated-reference-library.ts]
        │      │    Кураторская библиотека в БД → топ-5 по совпадению тегов
        │      │
        │      └─ searchDuckDuckGo(query) × N запросов
        │           DuckDuckGo HTML → парсинг result__a ссылок → топ 10 URL
        │
        ├─ 2. callCaptureService()    — делаем скриншоты
        │
        │      POST http://127.0.0.1:8890/capture
        │      { briefId, competitor, pages: [{url, kind, label}] }
        │
        │      Reference Capture Service (Linux, порт 8890):
        │        РЕАЛЬНЫЙ Chrome в виртуальной ОС, управляемый нашей системой.
        │        Не headless/Puppeteer — полноценный браузер в изолированной среде.
        │        Зачем реальный Chrome: обход anti-bot защит, точный CSS-рендеринг,
        │        webfonts, lazy-loaded контент, JavaScript-анимации.
        │        На том же Linux сервере работает MCP-Front.
        │
        │      → { assets: [{ publicUrl, fileName, kind, viewport }] }
        │
        ├─ 3. uploadScreenshotToDrive()
        │      Google Drive: UserRoot / Brief_{id} / Competitor_References / {name}/
        │      → driveFileId, driveUrl
        │
        ├─ 4. analyzeAsset()          — Gemini смотрит на скриншот
        │      Gemini Vision (gemini-2.5-pro) + изображение:
        │      page purpose, section order, nav pattern, card layout,
        │      CTA, typography mood, density, strengths, weaknesses
        │      → brief_reference_assets.analysis_json
        │
        ├─ 5. buildReferenceSummary() — стратегия дизайна
        │      referenceStrategistAgent (VoltAgent) или Gemini fallback
        │      → recommended_direction, style_keywords, market_patterns,
        │         opportunities_to_differentiate, do[], avoid[],
        │         recommended_references[]
        │
        └─ 6. mergeReferenceSectionIntoBrief()
               Вставляет <!-- REFERENCE_ANALYSIS_START/END --> в бриф:
                 ## Competitive Landscape
                 ### Selected References
                 ### Reference Screenshots
                 ### Recommended Visual Direction (do / avoid)
               → UPDATE briefs SET markdown_content, reference_analysis_json,
                   reference_status='completed'
```

### Таблица: brief_reference_assets

```sql
CREATE TABLE brief_reference_assets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id      UUID REFERENCES briefs(id),
  source_url    TEXT,       -- исходный URL конкурента
  final_url     TEXT,       -- после редиректов
  competitor    TEXT,       -- hostname (напр. 'stripe')
  page_kind     TEXT,       -- 'homepage', 'pricing', 'about'
  viewport      TEXT,       -- 'desktop', 'mobile'
  title         TEXT,
  public_url    TEXT,       -- URL скриншота (CDN/nginx)
  local_path    TEXT,
  drive_file_id TEXT,
  drive_url     TEXT,
  analysis_json JSONB,      -- Gemini Vision анализ
  selected      BOOLEAN,
  updated_at    TIMESTAMPTZ
);
```

### Переменные окружения

```bash
REFERENCE_CAPTURE_SERVICE_URL=http://127.0.0.1:8890   # сервис на Linux
REFERENCE_CAPTURE_TOKEN=secret                         # Bearer-токен
```

### Сервисы на Linux сервере (полный список)

```
порт 8890  — Reference Capture Service (Chrome в виртуальной ОС)
порт ???   — MCP-Front (прокси Figma MCP → mcp.figma.com)
PM2 daemon — workers/figma-builder.js
PM2 daemon — workers/demo-builder.js
Nginx      — demo.sitesynth.com → /var/www/sitesynth/demo.sitesynth.com/
```

---

## 12. Deployment
