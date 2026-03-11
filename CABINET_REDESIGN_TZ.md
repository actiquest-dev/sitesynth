# ТЗ: Переделка кабинета согласно Brief-схеме

## 1. ТЕКУЩИЙ БИЗНЕС-ПРОЦЕСС (Статус Quo)

### Цепочка действий новичка:
```
Пользователь → Вход/Регистрация → Cabinet → ??? (Затеряется)
                                      ↓
                              Видит 3 раздела:
                              - Orders (пусто)
                              - Projects (пусто) 
                              - Account Settings
```

### Проблемы текущего подхода:
1. **Нет единого flow** - кабинет показывает заказы/проекты, но новичок не знает что дальше делать
2. **Orders берутся из платежей** - для новичка это не имеет смысла, платежа еще не было
3. **Projects - это внешние данные** - привязаны к NocoBase, не имеют отношения к AI brief
4. **Нет инструмента для создания brief** - пользователь не видит как начать работу с AI агентом
5. **Files есть, но они оторваны от контекста** - пользователь не понимает зачем их загружать
6. **Нет guidance/onboarding** - новичок теряется в интерфейсе

---

## 2. ТРЕБУЕМЫЙ БИЗНЕС-ПРОЦЕСС (To-Be)

### Сценарий: Новый пользователь приходит в Cabinet

```
ШАГИ PER USER JOURNEY:

1️⃣  ВХОД В КАБИНЕТ
    └─ Пользователь видит:
       - Welcome message (привет, [имя])
       - Progress indicator (где он в процессе)
       - CTA Button: "Начать подготовку brief" | "Продолжить brief"

2️⃣  ВЫБОР РЕЖИМА РАБОТЫ
    ├─ Режим 1: "Самостоятельная подготовка"
    │  └─ Загрузить файлы → Запустить диалог с агентом
    │
    ├─ Режим 2: "Из существующего разговора"  
    │  └─ Выбрать разговор → Генерировать brief
    │
    └─ Режим 3: "Импорт данных"
       └─ Загрузить файл project-spec.json

3️⃣  STAGE 1: ПОДГОТОВКА ФАЙЛОВ
    ├─ File Upload Area (drag-drop)
    │  ├─ Brand Guidelines PDF
    │  ├─ Wireframes/Design Files
    │  ├─ Existing Documentation
    │  └─ Reference Links
    │
    ├─ Progress: [≡════════════] 25%
    │
    └─ Button: "Файлы готовы → Дальше"

4️⃣  STAGE 2: АГЕНТ ОТКРЫВАЕТ ДИАЛОГ
    ├─ AI Agent инициирует conversation:
    │  "Я видел ваши файлы. Расскажите о вашем проекте..."
    │
    ├─ Пользователь отвечает в чате (5-7 подробных ответов)
    │
    ├─ Система собирает данные:
    │  ├─ Мониторит ключевые фразы
    │  ├─ Извлекает структурированные данные
    │  ├─ Анализирует загруженные файлы
    │  └─ Заполняет скрытую BriefData сущность
    │
    ├─ Progress: [≡≡≡≡≡════════] 50%
    │
    └─ Button: "Я готов → Сгенерировать brief"

5️⃣  STAGE 3: ГЕНЕРАЦИЯ И СИНТЕЗ BRIEF
    ├─ Система:
    │  ├─ Вызывает generateBriefFromData()
    │  ├─ Передает: conversation + uploaded files + extracted data
    │  ├─ AI создает 8-section professional brief
    │  └─ Сохраняет в Supabase
    │
    ├─ UI показывает: "Генерирую ваш brief... ⏳"
    │
    ├─ Progress: [≡≡≡≡≡≡========] 75%
    │
    └─ Переход →

6️⃣  STAGE 4: REVIEW & EDIT
    ├─ Пользователь видит brief:
    │  ├─ 8 секций в красивом формате
    │  ├─ Иконки для каждой секции (🏢 ✅ 🎯 и т.д.)
    │  ├─ Данные из conversation подсвечены
    │  ├─ Данные из файлов отмечены [from files]
    │  └─ Рекомендации для улучшения
    │
    ├─ Actions:
    │  ├─ ✏️  Edit любую секцию
    │  ├─ 💬 Попросить переделать ("Переделай раздел... потому что...")
    │  ├─ 🔄 Regenerate весь brief
    │  └─ 📥 Download as PDF/Markdown
    │
    ├─ Progress: [≡≡≡≡≡≡≡═══════] 90%
    │
    └─ Button: "Brief готов → Сохранить"

7️⃣  STAGE 5: СОХРАНЕНИЕ И ЭКСПОРТ
    ├─ Brief сохранен в Supabase с:
    │  ├─ Timestamp создания
    │  ├─ Версия 1.0
    │  ├─ Status: "Approved"
    │  ├─ Связь к conversation_id
    │  └─ Связь к uploaded files
    │
    ├─ UI показывает success message
    │
    ├─ Progress: [≡≡≡≡≡≡≡≡≡≡≡≡≡≡] 100% ✅
    │
    └─ CTA: "Скачать PDF" | "Вернуться в кабинет"

8️⃣  ЗАВЕРШЕНИЕ: BRIEF В КАБИНЕТЕ
    ├─ Пользователь видит новый brief в списке:
    │  ├─ Project Name
    │  ├─ Created: May 3, 2026
    │  ├─ Status: ✅ Complete
    │  ├─ Sections: 8/8 filled
    │  └─ Actions: View | Edit | Download | Delete
    │
    └─ CTA: "Создать еще один brief"
```

---

## 3. НОВАЯ АРХИТЕКТУРА CABINET

### Top-Level Navigation:
```
┌─────────────────────────────────────────────────────────────────┐
│  CABINET / Your Project Dashboard                      Sign Out  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MAIN SECTIONS (Top Tabs):                                      │
│                                                                  │
│  [ Dashboard ] [ Briefs ] [ Conversations ] [ Files ] [ Settings]│
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. ДЕТАЛЬНАЯ СТРУКТУРА ПО РАЗДЕЛАМ

### 📊 DASHBOARD TAB (главная)
```
┌─────────────────────────────────────────────────┐
│ Welcome Back, Miguel! 👋                         │
│ You have 2 briefs in progress                   │
└─────────────────────────────────────────────────┘

┌─ Quick Stats ─────────────────────────────────┐
│  Total Briefs    |   In Progress   |  Complete │
│        5         |        2        |     3     │
└────────────────────────────────────────────────┘

┌─ Active Briefs (Quick Access) ────────────────┐
│                                                │
│  [1] 🏗️  Real Estate Platform                 │
│      Status: Stage 3 (AI Review)               │
│      Created: 2 weeks ago                      │
│      [Continue] [View] [Download]              │
│                                                │
│  [2] 🛍️  E-Commerce Redesign                  │
│      Status: Stage 2 (Conversation)            │
│      Created: 3 days ago                       │
│      [Continue Chat] [Delete Draft]            │
│                                                │
│  [3] 📱 Mobile App MVP                         │
│      Status: 🔴 Needs Revision                │
│      Created: 1 week ago                       │
│      [Edit] [Regenerate] [Download]            │
│                                                │
└────────────────────────────────────────────────┘

┌─ Recent Actions ──────────────────────────────┐
│  • Downloaded "Real Estate Platform" as PDF   │
│  • Started new brief "E-Commerce Redesign"    │
│  • Uploaded 3 files for "Mobile App MVP"      │
└────────────────────────────────────────────────┘

CTA BUTTON: [✨ Create New Brief]
```

---

### 📋 BRIEFS TAB
```
┌─ Filter & Search ─────────────────────────────┐
│  [All] [In Progress] [Review] [Complete]      │
│                              [Search...]       │
└────────────────────────────────────────────────┘

┌─ Brief List ──────────────────────────────────┐
│                                                │
│  Brief #1: "Real Estate Platform"             │
│  Status: Complete ✅                          │
│  Sections: 8/8                                │
│  Created: 2 weeks ago                         │
│  Size: 12 KB                                  │
│  [View] [Edit] [Download PDF] [Share] [Delete]│
│                                                │
│  Brief #2: "E-Commerce Redesign"              │
│  Status: In Progress (Stage 2/5)              │
│  Sections: 3/8                                │
│  Created: 3 days ago                          │
│  [Continue] [Delete Draft]                    │
│                                                │
│  ... (еще briefs)                             │
│                                                │
└────────────────────────────────────────────────┘

CTA BUTTON: [+ New Brief]
```

---

### 💬 CONVERSATIONS TAB
```
┌─ Link Brief to Conversation ──────────────────┐
│  Select a past conversation to generate brief │
│  [Conversation dropdown]                      │
│  [Generate Brief from This]                   │
└────────────────────────────────────────────────┘

┌─ Past Conversations List ─────────────────────┐
│                                                │
│  [1] Real Estate Platform Discussion          │
│      4 messages | Agent: Briefing              │
│      Created: 2 weeks ago                     │
│      Brief Status: ✅ Generated                │
│      [View] [Regenerate Brief] [Delete]       │
│                                                │
│  [2] E-Commerce Chat                          │
│      12 messages | Agent: Presale              │
│      Created: 3 days ago                      │
│      Brief Status: ⏳ In Progress              │
│      [View] [Generate Brief] [Delete]         │
│                                                │
└────────────────────────────────────────────────┘
```

---

### 📁 FILES TAB
```
┌─ File Upload Area ────────────────────────────┐
│                                                │
│   📤 Drag files here or click to browse       │
│   Supported: PDF, DOC, DOCX, TXT, JPG, PNG    │
│   Max 50MB per file                           │
│                                                │
└────────────────────────────────────────────────┘

┌─ Recent Files ────────────────────────────────┐
│                                                │
│  📄 BrandGuidelines.pdf         2.3 MB        │
│  Creator: Briefing Agent                      │
│  Created: 5 days ago                          │
│  Used in: Real Estate Platform brief          │
│  [Download] [Delete]                          │
│                                                │
│  🖼️  Wireframes.figma           45 MB         │
│  Creator: You                                 │
│  Created: 1 week ago                          │
│  Used in: 2 briefs                            │
│  [Download] [Delete]                          │
│                                                │
│  📋 Requirements.docx            1.2 MB       │
│  Creator: You                                 │
│  Created: 10 days ago                         │
│  Used in: E-Commerce Redesign brief           │
│  [Download] [Delete]                          │
│                                                │
└────────────────────────────────────────────────┘

Total: 48.5 MB of 100 MB used
```

---

### ⚙️ SETTINGS TAB
```
┌─ Account Settings ────────────────────────────┐
│                                                │
│  Email: miguel@example.com                    │
│  Name: Miguel Aprossine                       │
│  Plan: Professional                           │
│  Joined: January 15, 2026                     │
│                                                │
│  [Edit Profile] [Change Password]             │
│                                                │
└────────────────────────────────────────────────┘

┌─ API Configuration ───────────────────────────┐
│  API Key: sk_pro_xxxxxxxxxxxx                 │
│  [Regenerate] [Copy]                          │
│  [View Documentation]                         │
└────────────────────────────────────────────────┘

┌─ Preferences ─────────────────────────────────┐
│  ☑ Send me email updates                      │
│  ☐ Show tips and tutorials                    │
│  ☑ Mark completed briefs as done              │
└────────────────────────────────────────────────┘
```

---

## 5. UI FLOW: СОЗДАНИЕ НОВОГО BRIEF

```
┌─ ШАГ 1: НАЧАЛО ───────────────────────────────┐
│                                                │
│  [✨ Create New Brief]                        │
│                    ↓                          │
│  Выбери режим:                                │
│  [ ] Empty Draft (начать с нуля)              │
│  [ ] Upload Files (загрузить files)           │
│  [ ] From Conversation (из чата)              │
│                                                │
└────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────────────────────┐
        │     ВЫБРАН РЕЖИМ: "Upload Files"      │
        └───────────────────────────────────────┘
                    ↓
┌─ ШАГИ 2-5: ЦЕПОЧКА ───────────────────────────┐
│                                                │
│  [25%] Upload Files                           │
│        ↓ (пользователь загрузил файлы)        │
│  [50%] Conversation with Agent                │
│        ↓ (пользователь обсудил с AI)         │
│  [75%] Generate Brief                         │
│        ↓ (AI создал brief)                    │
│  [100%] Review & Save                         │
│         (пользователь одобрил)                │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 6. МОДЕЛИ ДАННЫХ (обновленные)

### Brief Model (Supabase):
```typescript
interface Brief {
  id: string                    // primary key
  user_email: string            // owner
  
  // Metadata
  project_name: string          // e.g. "Real Estate Platform"
  status: 'draft' | 'review' | 'approved' | 'archived'
  stage: 1 | 2 | 3 | 4 | 5     // 5-stage workflow
  
  // Content
  conversation_id?: string      // link to chat
  file_ids: string[]            // uploaded files used
  brief_data: BriefData         // 8-section structure
  markdown_content: string      // formatted markdown
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
  version: number               // for versioning
  
  // AI Analysis
  extracted_from_files: object  // what AI found in files
  confidence_score?: number     // how confident is AI
  revision_notes?: string[]     // what user revised
}
```

### BriefData Model:
```typescript
interface BriefData {
  projectName: string
  
  companyIntroduction: {
    companyName: string
    mission: string
    currentProducts: string[]
    problemSolved: string
    targetUsers: string
  }
  
  scopeAndAcceptanceCriteria: {
    mainObjective: string
    deliverables: string[]
    mustHaveFeatures: string[]
  }
  
  goalsAndObjectives: {
    businessGoals: string[]
    successMetrics: string[]
  }
  
  competitors: {
    directCompetitors: Competitor[]
  }
  
  targetAudience: {
    userPersonas: UserPersona[]
  }
  
  whatBeenDone: {
    existingAssets: string[]
    pastAttempts?: string[]
  }
  
  timelineAndBudget: {
    timeline: string
    budget: string
    phases: Phase[]
  }
  
  nextSteps: {
    actionItems: string[]
    timeline: string
  }
}
```

---

## 7. API ENDPOINTS (новые/обновленные)

```
GET    /api/cabinet/dashboard
       → Returns: stats, active briefs, recent actions

GET    /api/briefs
POST   /api/briefs
       → Create new brief via multiple modes

GET    /api/briefs/:id
PATCH  /api/briefs/:id
DELETE /api/briefs/:id
       → Full CRUD

GET    /api/briefs/conversations/:conversationId
       → Get conversation and auto-extract brief data

POST   /api/briefs/regenerate/:id
       → Regenerate brief from existing data

GET    /api/briefs/:id/export?format=pdf|md
       → Export brief

GET    /api/cabinet/conversations
       → List all past conversations

POST   /api/cabinet/files/link
       → Link file to brief

GET    /api/chat/guided-briefing
       → Start AI-guided conversation for brief creation
```

---

## 8. НОВЫЕ КОМПОНЕНТЫ (Vue)

```
pages/
├── cabinet.vue                  (перестроена на таб-систему)
│
components/
├── cabinet/
│   ├── CabinetTabs.vue         (Tab navigation)
│   ├── DashboardView.vue       (Dashboard tab)
│   ├── BriefsView.vue          (Briefs tab)
│   ├── ConversationsView.vue   (Conversations tab)
│   ├── FilesView.vue           (Files tab)
│   ├── SettingsView.vue        (Settings tab)
│   │
│   └── BriefCreationFlow.vue   (5-stage wizard)
│       ├── StageUploadFiles.vue
│       ├── StageConversation.vue
│       ├── StageGenerate.vue
│       ├── StageReviewEdit.vue
│       └── StageSaveExport.vue
│
└── modals/
    ├── BriefPreviewModal.vue   (Full brief view)
    └── BriefEditModal.vue       (Edit sections)
```

---

## 9. КРИТЕРИИ УСПЕХА

- ✅ Новичок понимает что делать сразу при входе
- ✅ 5-7 пользователей смогут создать brief за 10-15 минут без помощи
- ✅ Все данные (файлы, чат, brief) связаны и видны в системе
- ✅ Brief содержит 80%+ информации из conversation + uploaded files
- ✅ Пользователь может отредактировать любую секцию brief
- ✅ Экспорт в PDF форматирован профессионально
- ✅ Версионирование brief работает (история изменений)

---

## 10. ПРИОРИТЕТ РЕАЛИЗАЦИИ

**Phase 1 (MVP):**
- [ ] Переделка Cabinet на таб-систему
- [ ] Dashboard + Briefs tabs
- [ ] Brief creation flow (5 stages)
- [ ] Files integration with AI

**Phase 2 (Enhancement):**
- [ ] Conversations tab с re-generation
- [ ] Settings tab
- [ ] Advanced edit/revision workflow

**Phase 3 (Polish):**
- [ ] Versioning & history
- [ ] Collaboration features
- [ ] Advanced export options

---

## 11. ПРИМЕЧАНИЯ

1. **AI Agent role**: При создании brief, агент должен знать:
   - Какие файлы пользователь загрузил
   - Что пользователь сказал в чате
   - Какие данные уже извлечены

2. **File processing**: Для больших файлов (>5MB) нужен:
   - Async processing
   - Progress indicator
   - Retry logic

3. **URL Structure**: 
   - `/cabinet` → Dashboard
   - `/cabinet/briefs` → Briefs list
   - `/cabinet/briefs/new` → Create new
   - `/cabinet/briefs/:id` → View/Edit
   - `/cabinet/conversations` → Past chats
   - `/cabinet/files` → File management
   - `/cabinet/settings` → Account settings


---

## 12. ИНФОРМАЦИОННАЯ АРХИТЕКТУРА: Как избежать перегруза

### Проблема: "Information Overload"
Слишком много информации на экране → пользователь не знает с чего начать → bounce rate выше.

### Решение: Progressive Disclosure (Прогрессивное раскрытие информации)

#### ПРАВИЛО 1: Primary Action всегда видна
- Primary CTA visible as large button - "CREATE NEW BRIEF"
- 2-3 most recent briefs below as quick access options
- "Show all" link doesn't intimidate new users

#### ПРАВИЛО 2: Контекстная информация скрыта по умолчанию
- Brief cards show: Name, Status, Stage, Created date
- Click [More...] to reveal: Files used, Conversation count, Version, Size

#### ПРАВИЛО 3: Таб-навигация (не боковая сайдбар)
- Top tabs: [Dashboard] [Briefs] [Conversations] [Files]
- Settings and Help hidden in account dropdown
- Clean, focused content area

---

## 13. AI AGENT ВО ПРОЦЕССЕ СОЗДАНИЯ BRIEF

### Роли агента по стадиям:

#### STAGE 1: FILE UPLOAD
- AI processes files in background (async)
- Scans types, extracts text, caches for next stage
- No UI interaction during this phase

#### STAGE 2: GUIDED CONVERSATION
AI becomes active guide:
- "I reviewed your files. What's the main business problem?"
- AI silently extracts BriefData while engaging user
- Adapts next question based on extracted data
- Shows progress: "70% of brief data collected"

#### STAGE 3: GENERATE
- User clicks "Ready! Generate my brief"
- AI combines: BriefData + file contents + skill prompt
- Returns 8-section professional brief

#### STAGE 4: REVIEW & EDIT
- User can request refinements: "Rewrite Goals for KPIs"
- AI regenerates specific section using same files + context
- User can regenerate entire brief with different approach

#### STAGE 5: SAVE & EXPORT
- Brief saved to database with version history
- Can export as PDF or Markdown
- Can archive for later reference

---

## 14. CABINET MENU: Progressive Disclosure

### Tier 1 (Always Visible):
- Primary CTA: "Create New Brief"
- 1-2 active briefs (if any)
- Current user email

### Tier 2 (Visible in context):
- Brief status/progress indicators
- File count used
- Brief created date

### Tier 3 (On hover/expand):
- Detailed metadata
- Advanced actions
- Edit history

### Tier 4 (Hidden):
- API config (power users only)
- Team settings (team feature future)
- Export logs (admin)

### By User Experience Level:

**First-time User (Day 1):**
- Dashboard tab only
- Welcome message + "What is a brief?" help
- Huge "Create New Brief" button
- Minimal settings (profile + password)

**Active User (Week 1+):**
- All main tabs visible
- Dashboard: Stats + active briefs
- Briefs: Filterable list view
- Files: Upload management
- Conversations: Chat history
- Settings: Account + Preferences

**Power User (10+ briefs):**
- All tabs + advanced filtering
- Bulk actions on briefs
- API key management
- Usage analytics
- Team collaboration features
