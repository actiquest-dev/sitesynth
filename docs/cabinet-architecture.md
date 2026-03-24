# SiteSynth Cabinet — Архитектура и User Journey

> Документ описывает полный цикл клиента от первого контакта до готового сайта,
> внутреннюю архитектуру кабинета и интеграции с внешними сервисами.

---

## 1. Полный путь клиента

```
Landing Page
    │
    ▼
[Presale Chat — Consultant Agent]
    │  Анонимный пользователь. Создаётся conversation_id.
    │  Сохраняется в localStorage['presale_conversation_id']
    │
    ▼
Intake Form  (/intake/starter | /intake/growth | /intake/enterprise)
    │  6 шагов: Service → Complexity → Features → Budget → Contact → Payment
    │
    ▼
Payment  (/payment)  ← Stripe
    │  После успеха presale_conversation_id сохраняется в paymentResult
    │  Создаётся authToken в localStorage
    │
    ▼
Confirmation  (/confirmation)
    │
    ▼
Login / Register  (/login)
    │  Google OAuth или Email
    │  После логина: claimPresaleConversation(email)
    │    → POST /api/conversations/claim { conversation_id, user_email }
    │    → conversation теперь принадлежит пользователю
    │
    ▼
Cabinet  (/cabinet)
    │
    ├── [Brief Wizard]
    │       6 фаз: upload → description → questions → generating → review → saved
    │       Бриф создаётся с тем же conversation_id (единый тред)
    │
    ├── [Brief Editor + Post-Brief Chat]
    │       TipTap WYSIWYG редактор
    │       Design Strategist Agent проактивно помогает улучшить бриф
    │       → Save сохраняет в Supabase (briefs.markdown_content + briefs.name)
    │       → Версионирование в brief_versions
    │
    ├── [Generate Design Spec]
    │       AI анализирует бриф → структура страниц + UI блоков
    │       Сохраняется в briefs.design_spec_json
    │
    ├── [Figma Build]
    │       Architect Agent → план → Figma Builder Agent → компоненты
    │       Critic Agent → ревью → итерации
    │
    └── [Demo Build]
            Demo Builder → готовый сайт
```

---

## 2. Единый Conversation ID

```
Весь цикл использует ОДИН conversation_id:

presale chat → создаёт conversation_id=X → localStorage
payment      → сохраняет X в paymentResult
login        → claim: conversation[X].user_email = user@email.com
brief        → создаётся с conversation_id=X (ищет существующий по email)
post-brief   → открывает X, загружает историю, добавляет сообщения
figma build  → продолжает в X
```

**Почему это важно:** AI-агенты видят полную историю взаимодействия.
Design Strategist знает что обсуждалось на presale. Figma Builder
знает контекст брифа. Нет разрыва между этапами.

---

## 3. AI Агенты (VoltAgent)

| Агент | Роль | Когда активен |
|-------|------|---------------|
| **Consultant Agent** | Presale консультант, ведёт к Intake Form | Landing page, анонимный чат |
| **Briefing Agent** | Помогает заполнить бриф, задаёт вопросы | Wizard фаза `questions` |
| **Design Strategist** | Post-brief, улучшает бриф для дизайн-спеков | После создания брифа |
| **Architect Agent** | Планирует структуру Figma файла | Перед Figma Build |
| **Figma Builder Agent** | Строит компоненты в Figma через Plugin API | Figma Build |
| **Critic Agent** | Ревьюит результат, даёт фидбек | После каждой итерации Figma |
| **Reference Strategist** | Анализирует референсы из Google Drive | Перед генерацией |
| **Demo Builder** | Собирает демо-сайт | Demo Build |

**Runtime:** VoltAgent + VoltOps (observability/логи)
**LLM:** Gemini 2.5 Pro (основной) → 2.0 Pro → 1.5 Pro (fallback при 503)

---

## 4. Внешние сервисы

### Supabase (база данных + auth)
```
Таблицы:
  conversations    — треды (один на весь цикл клиента)
  messages         — сообщения чата
  briefs           — созданные брифы
    ├── markdown_content  — текст брифа
    ├── name              — название проекта
    ├── design_spec_json  — сгенерированные дизайн-спеки
    └── conversation_id   — ссылка на тред
  brief_versions   — история изменений брифа
  orders           — заказы из Intake Form
  claim_tokens     — для связи анонимного conversation с юзером
```

### Google Drive (хранилище файлов)
- Файлы клиента загружаются в **Shared Drive** (не personal)
- Сервисный аккаунт: `sitesynth-drive@...iam.gserviceaccount.com`
- Resumable upload URLs — обходит лимит Vercel 4.5 MB
- Папки создаются автоматически: `{userEmail}_Files/`
- Файлы читаются агентами при генерации брифа и дизайн-спеков

### Stripe (платежи)
- Обрабатывает оплату Intake Form
- Webhook: `/api/webhooks/stripe` → сохраняет заказ в Supabase
- После успеха: `/api/auth/after-payment` создаёт пользователя в Supabase Auth

### Google OAuth
- Вход через Google на `/login`
- `useGoogleAuth` composable управляет токеном
- После входа: `claimPresaleConversation()` связывает анонимный тред

### Figma Plugin API
- Cabinet отправляет команды через Plugin API
- Figma Builder Agent создаёт компоненты программно
- Critic Agent анализирует скриншоты результата

### VoltOps (observability)
- Логирование всех вызовов агентов
- `VOLTAGENT_API_KEY` + `VOLTAGENT_PROJECT_ID` в env
- Fire-and-forget чтобы не блокировать serverless функции Vercel

---

## 5. Архитектура кабинета (cabinet.vue)

### Основные разделы
```
Cabinet
├── Sidebar
│     ├── Навигация (Dashboard / Projects)
│     ├── Пользователь (email + аватар)
│     └── Log Out кнопка
│
├── Main Content
│     ├── Stats (Total Projects, Total Spent, Active Websites)
│     │
│     ├── Projects view (список брифов)
│     │     └── Карточки: название, превью, дата
│     │
│     └── Brief Editor view (выбранный бриф)
│           ├── Topbar: ← Back | Save | Delete
│           ├── Название + даты
│           ├── Edit mode: TipTap WYSIWYG + Generate Design Spec
│           ├── View mode: отформатированный HTML
│           └── Design Specification Structure (страницы + UI блоки)
│
└── AIChatDrawer (всегда доступен, справа)
      ├── Presale: Consultant Agent
      ├── Briefing: Briefing Agent (в Wizard)
      └── Post-Brief: Design Strategist
```

### State Management
- `selectedBrief` — открытый бриф
- `briefEditMode` — режим редактирования
- `briefEditContent` — контент в TipTap (HTML)
- `designSpec` — сгенерированная структура дизайна
- `userEmail` — из Google Auth / localStorage

---

## 6. Brief Wizard — детально

```
Фаза 1: upload
  └── Drag&Drop или выбор файлов
  └── Название проекта (Brief Name input)
  └── Уже загруженные файлы из Google Drive (Available Project Files)

Фаза 2: description
  └── Текстовое описание проекта

Фаза 3: questions
  └── POST /api/questionnaire/generate → Gemini генерирует вопросы
  └── Динамический опросник с ветвлением
  └── Каждый ответ сохраняется для контекста

Фаза 4: generating
  └── POST /api/brief/generate
        → Читает файлы из Google Drive
        → Передаёт ответы + описание + файлы в Gemini
        → Возвращает структурированный markdown

Фаза 5: review
  └── Превью сгенерированного брифа
  └── Кнопка Enhance (AI улучшение) + Undo

Фаза 6: saved
  └── POST /api/briefs
        → Ищет существующий conversation по user_email
        → Или создаёт новый если первый бриф
        → Сохраняет в briefs таблицу
  └── finishWizard() → открывает Brief Editor + Post-Brief Chat
```

---

## 7. Переменные окружения (Vercel)

```env
# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON=  # полный JSON сервисного аккаунта
GOOGLE_SHARED_DRIVE_ID=

# Gemini AI
GOOGLE_AI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# VoltAgent
VOLTAGENT_API_KEY=
VOLTAGENT_PROJECT_ID=

# App
NUXT_PUBLIC_SITE_URL=https://www.sitesynth.com
```

---

## 8. Deployment

- **Платформа:** Vercel (Serverless Functions)
- **Framework:** Nuxt 3 (SSR + API routes)
- **Branch:** `main` → auto-deploy на Production
- **Лимиты Vercel:** 4.5 MB body → обходится через resumable upload URLs для файлов
- **Node.js:** v22.x

---

*Документ обновлён: Март 2026*
