# Brief Agent Methodology — Инструкция для AI Агента

## Обзор

Агент создания Brief проводит пользователя через **7-этапный процесс** сбора информации для создания профессионального design/project brief. Методология основана на лучших практиках из [dbe1.txt](./dbe1.txt).

**Цель:** Извлечь из пользователя все необходимые данные структурированно, чтобы создать качественный brief, который направит работу дизайнеров/разработчиков.

---

## Структура Brief (8 Основных Секций)

Финальный brief содержит эти секции:

1. **Project Overview** — Обзор проекта
2. **Project Goals** — Цели и задачи  
3. **Target Audience** — Целевая аудитория
4. **Brand Guidelines** — Брендовые требования
5. **Deliverables** — Что нужно создать
6. **Timeline & Budget** — Сроки и бюджет
7. **Technical Requirements** — Технические ограничения
8. **Success Metrics** — Метрики успеха

---

## 7 Этапов Wizard для Сбора Данных

### **Этап 1: Upload & Analysis (Загрузка и анализ файлов)**

**Цель:** Пользователь загружает файлы (примеры дизайна, конкурентов, бренд-гайдлайны, брифы)

**Что делает агент:**
- Принимает файлы (PDF, DOC, изображения, ZIP с проектами)
- Анализирует содержимое (если файлы текстовые/PDF)
- Извлекает ключевую информацию (цвета, шрифты, структура, примеры контента)
- Сохраняет анализ как **исходные данные** для brief

**Вопросы для пользователя:**
```
- Какие файлы вы загружаете? (выбор типов)
- Это примеры того, что нужно создать, или референсы конкурентов?
- Есть ли уже существующий брендовый гайдлайн?
- Что самое важное в этих файлах для вашего проекта?
```

**Результат:** Массив объектов файлов с метаданными и анализом

---

### **Этап 2: Project Overview (Обзор проекта)**

**Цель:** Понять, ЧТО создаем и ЗАЧЕМ

**Вопросы (в конверсационном стиле):**

```
Q1: Как называется ваш проект?
   → Сохраняем: projectName

Q2: В одном предложении — что вы создаете?
   (если не ясно → уточняем)
   → Сохраняем: projectDescription

Q3: Это новый проект или переделка существующего?
   - Новый
   - Редизайн/улучшение существующего
   - Расширение текущего
   → Сохраняем: projectType

Q4: Какой тип проекта?
   - Website/Landing page
   - Mobile app
   - Web application / SaaS
   - Branding/Identity system
   - E-commerce platform
   - Other
   → Сохраняем: projectCategory

Q5: В каких отраслях вы работаете / кто ваша компания?
   → Сохраняем: industry, companyDescription
```

**Интеллектуальность агента:**
- Если пользователь расплывчат, задать уточняющие вопросы
- Предложить примеры на основе заливаемых файлов
- Автоматически сформировать одно-два предложения описания проекта

**Ответы агента (примеры):**
```
"Спасибо! Значит, мы создаем [projectName], который [projectDescription]. 
Это новый [projectType] для [industry] бизнеса. Отлично!"
```

---

### **Этап 3: Project Goals (Цели и задачи)**

**Цель:** Определить, ЧТО нужно достичь и ПОЧЕМУ

**Вопросы (3-5 ключевых вопросов):**

```
Q1: Какова основная цель этого проекта?
   (Примеры)
   - Увеличить конверсию на X%
   - Улучшить пользовательский опыт
   - Запустить новый продукт
   - Переехать на новую платформу
   - Повысить брендовое восприятие
   → Сохраняем: primaryGoal (string)

Q2: Какие конкретные проблемы вы решаете?
   (Пользователь пишет в свободной форме)
   → Сохраняем: problemsToSolve (array of strings)

Q3: Какие KPI/метрики показывают успех проекта?
   (Примеры)
   - Увеличение трафика на X%
   - Снижение bounce rate
   - Увеличение среднего чека
   - Рост пользовательской базы
   - Улучшение NPS
   → Сохраняем: successMetrics (array)

Q4: Есть ли ограничения или риски, о которых мы должны знать?
   (Примеры)
   - Есть существующие клиенты, которых нельзя потревожить
   - Требования к совместимости с legacy системами
   - Строгие требования регулятора
   - Бюджетные ограничения
   → Сохраняем: constraints (array)

Q5: Кто основной stakeholder / decision maker?
   (Имя, должность)
   → Сохраняем: primaryStakeholder
```

**Ответ агента:**
```
"Вижу, вы хотите достичь [primaryGoal], решив проблемы с [problemsToSolve].
Успех будет измеряться через [successMetrics].
Отлично, это сформирует направление нашего brief!"
```

---

### **Этап 4: Target Audience (Целевая аудитория)**

**Цель:** Понять, ДЛЯ КОГО мы создаем

**Вопросы (persona-driven):**

```
Q1: Угадайте, кто основной пользователь вашего продукта?
   (Агент предлагает опции на основе проекта)
   Примеры:
   - Владельцы малого бизнеса 25-45 лет
   - IT инженеры 22-35 лет
   - Домохозяйки 30-55 лет
   - C-level executives
   → Сохраняем: primaryPersona

Q2: Какие демографические характеристики?
   - Возраст: __-__ лет
   - Пол: Male / Female / All
   - Доход: Low / Medium / High
   - Образование: High school / Bachelor / Master+
   - Локация: (Country/Region)
   → Сохраняем: demographics

Q3: Какие боли / проблемы у этой аудитории?
   (Пользователь описывает — агент структурирует)
   Примеры:
   - Нет времени на учет вручную
   - Сложно найти нужную информацию быстро
   - Платят слишком много за текущее решение
   → Сохраняем: painPoints (array)

Q4: Как они сейчас используют подобные продукты?
   - Mobile-first (всегда в дороге)
   - Desktop-focused (офис)
   - Mixed (и то, и другое)
   → Сохраняем: devicePreference

Q5: Какие еще personas важны? (secondary audience)
   (Повторяем процесс для 1-2 дополнительных personas)
   → Сохраняем: secondaryPersonas (array)
```

**Ответ агента:**
```
"Отлично! Ваша основная аудитория — это [demographic] людей которые 
сталкиваются с [painPoints]. Они в основном используют [devicePreference].
Это очень важно для дизайна!"
```

---

### **Этап 5: Brand Guidelines (Брендовые требования)**

**Цель:** Собрать/уточнить брендовые параметры

**Вопросы:**

```
Q1: Есть ли уже брендовый гайдлайн?
   - Да, загрузили в файлы (Берем из Stage 1)
   - Да, скажу устно
   - Нет, создаем с нуля
   → Сохраняем: brandGuidelineStatus

Q2: Основные цвета бренда? (добавляем на палитру)
   Примеры форматов:
   - Первичный: #0033FF (Синий)
   - Вторичный: #8D35FF (Фиолетовый)
   - Акцент: #FF5733 (Красный)
   → Сохраняем: colorPalette (array of {name, hex, usage})

Q3: Основные шрифты / Typography?
   - Заголовки: Montserrat Bold
   - Основной текст: Inter Regular
   - Акценты: Playfair Display
   → Сохраняем: typography (array)

Q4: Tone of voice / как говорить с аудиторией?
   Примеры:
   - Профессиональный и формальный
   - Дружелюбный и casual
   - Энергичный и инновационный
   - Консервативный и надежный
   → Сохраняем: toneOfVoice

Q5: Какой главный message бренда? (миссия/слоган)
   → Сохраняем: brandMessage

Q6: Примеры логотипа / визуальной идентичности?
   (Если загрузили файлы — берем оттуда)
   → Сохраняем: logoDescription, visualStyle
```

**Ответ агента:**
```
"Спасибо! Бренд [brandName] использует цветовую палитру от [primaryColor] до [secondaryColor],
говорит [toneOfVoice] тоном и несет сообщение '[brandMessage]'.
Это хорошо структурирует визуальное направление!"
```

---

### **Этап 6: Deliverables (Что нужно создать)**

**Цель:** Определить конкретные артефакты/доставляемые результаты

**Вопросы:**

```
Q1: Какие основные deliverables нужны?
   (Multiple select)
   - [ ] Wireframes (Low-fidelity sketches)
   - [ ] Mockups (Static designs)
   - [ ] Interactive prototypes (Figma/Adobe XD)
   - [ ] Brand guidelines document
   - [ ] Design system / component library
   - [ ] Developer handoff specs
   - [ ] User flows / Information architecture
   - [ ] Responsive design (mobile + tablet + desktop)
   - [ ] Animations/Micro-interactions specs
   - [ ] Other: _____
   → Сохраняем: deliverables (array)

Q2: Какое разрешение / breakpoints нужны?
   (Если выбрал responsive)
   - Mobile: 375px, 414px
   - Tablet: 768px, 834px
   - Desktop: 1440px, 1920px
   → Сохраняем: breakpoints

Q3: Сколько страниц / экранов нужно спроектировать?
   (Часто это зависит от проекта)
   Примеры:
   - Сайт: 8-15 страниц
   - App: 15-30 экранов
   - SaaS: 20-40 экранов
   → Сохраняем: pageCount (estimated)

Q4: Какая структура напроектировать?
   (Пользователь описывает / показывает в файлах)
   Пример:
   - Home
   - Services (5 подстраниц)
   - Case Studies
   - Team
   - Contact
   - Blog listing
   → Сохраняем: sitemap / navigation structure

Q5: Есть ли специфические features/интерактивы?
   (Примеры)
   - Фильтры и сортировка
   - Поиск с автодополнением
   - Модальные окна
   - Формы с валидацией
   - Dashboard с данными
   → Сохраняем: interactiveFeatures (array)
```

**Ответ агента:**
```
"Отлично! Нам нужно создать [deliverable1], [deliverable2] и [deliverable3].
Это будет включать [pageCount] страниц/экранов с основной структурой:
[sitemap]. Начинаем работу!"
```

---

### **Этап 7: Timeline & Budget (Сроки и бюджет)**

**Цель:** Установить реальные ожидания по времени и ресурсам

**Вопросы:**

```
Q1: Когда нужен финальный результат?
   - Дата (календарь)
   - Количество недель
   → Сохраняем: deadline (ISO date)

Q2: Это срочный проект (fast-track) или спокойный?
   - Urgent (1-2 недели)
   - Normal (2-4 недели)
   - Relaxed (4+ недель)
   → Сохраняем: urgency

Q3: Какой примерный бюджет?
   (Диапазон)
   - Low: 500-2000$
   - Medium: 2000-5000$
   - High: 5000-15000$
   - Premium: 15000+$
   → Сохраняем: budgetRange

Q4: Сколько редакций/итераций ожидаете?
   (Примеры)
   - 1 (только финал)
   - 2 (первый draft + финал)
   - 3-5 (полный цикл feedback)
   - Unlimited (до тех пор пока не получится)
   → Сохраняем: revisionRounds

Q5: Есть ли промежуточные deadline-ы / milestones?
   (Пример)
   - Week 1: Wireframes
   - Week 2: High-fidelity mockups
   - Week 3: Iterations & finalization
   → Сохраняем: milestones (array)
```

**Ответ агента:**
```
"Понял! У вас есть [timeframe] до [deadline].
Это [urgency] проект с бюджетом [budgetRange].
Планируем [revisionRounds] раундов feedback.
Добавим промежуточные checkpoints: [milestones].
Это поможет нам доставить результат вовремя!"
```

---

### **Этап 8: Technical Requirements & Review (Технические требования и финализация)**

**Цель:** Собрать технические ограничения и провести финальную проверку

**Вопросы:**

```
Q1: Какие технические ограничения / требования?
   (Examples)
   - Совместимость с конкретными браузерами
   - Интеграции с API / backend системами
   - Требования доступности (WCAG, A11y)
   - Performance requirements (Lighthouse scores)
   - SEO requirements
   - CMS integration (WordPress, Webflow, Custom)
   → Сохраняем: technicalRequirements (array)

Q2: Есть ли существующая техническая архитектура?
   (Если да)
   - Current tech stack:
   - Frameworks/Libraries:
   - Hosting/Infrastructure:
   → Сохраняем: existingTechStack

Q3: Какие документы или стандарты нужно соблюдать?
   (Legal/compliance)
   - GDPR
   - CCPA
   - Industry-specific standards
   - Internal policies
   → Сохраняем: complianceRequirements

Q4: Финальная проверка — все ли верно?
   (Агент резюмирует весь brief, пользователь подтверждает)
   
   Примерный текст:
   ```
   📋 **ФИНАЛЬНЫЙ BRIEF**
   
   **Проект:** [projectName]
   **Категория:** [projectCategory]
   **Цель:** [primaryGoal]
   
   **Аудитория:** [primaryPersona]
   - Боли: [painPoints]
   -Device: [devicePreference]
   
   **Бренд:**
   - Цвета: [colorPalette]
   - Стиль: [toneOfVoice]
   
   **Deliverables:** [deliverables]
   **Страниц/Экранов:** [pageCount]
   
   **Сроки:** [deadline]
   **Бюджет:** [budgetRange]
   **Редакции:** [revisionRounds]
   
   **Технические требования:**
   - [technicalRequirement1]
   - [technicalRequirement2]
   ```
   
   Вопрос: "Все верно? Есть ли что-то, что нужно изменить или уточнить?"
   
   → Сохраняем: briefApprovalStatus (approved / needs changes)
```

**Если нужны изменения:**
- Агент спрашивает, что нужно изменить
- Обновляет данные
- Снова показывает финальный brief

---

## Data Model (Структура данных Brief)

```typescript
interface BriefData {
  // Stage 1: Files
  uploadedFiles: Array<{
    id: string
    name: string
    type: 'pdf' | 'image' | 'document' | 'zip'
    analysis: string
    uploadedAt: ISO8601
  }>

  // Stage 2: Project Overview
  projectName: string
  projectDescription: string
  projectType: 'new' | 'redesign' | 'expansion'
  projectCategory: string // 'website' | 'app' | 'saas' | 'branding' | 'ecommerce' | 'other'
  industry: string
  companyDescription: string

  // Stage 3: Goals
  primaryGoal: string
  problemsToSolve: string[]
  successMetrics: Array<{
    metric: string
    target?: string | number
  }>
  constraints: string[]
  primaryStakeholder: {
    name: string
    title: string
  }

  // Stage 4: Target Audience
  primaryPersona: {
    name: string
    demographics: {
      ageRange: [number, number]
      gender: 'male' | 'female' | 'all'
      income: 'low' | 'medium' | 'high'
      education: string
      location: string
    }
    painPoints: string[]
    devicePreference: 'mobile' | 'desktop' | 'mixed'
  }
  secondaryPersonas: Array<Persona>

  // Stage 5: Brand
  brandGuidelineStatus: 'existing' | 'partial' | 'new'
  colorPalette: Array<{
    name: string
    hex: string
    usage: string
  }>
  typography: Array<{
    type: 'heading' | 'body' | 'accent'
    fontName: string
    weight: string
  }>
  toneOfVoice: string
  brandMessage: string
  logoDescription: string
  visualStyle: string

  // Stage 6: Deliverables
  deliverables: string[] // Array of specific things to create
  breakpoints: {
    mobile: number[]
    tablet: number[]
    desktop: number[]
  }
  pageCount: number
  sitemap: string // Text representation
  interactiveFeatures: string[]

  // Stage 7: Timeline & Budget
  deadline: ISO8601
  urgency: 'urgent' | 'normal' | 'relaxed'
  budgetRange: 'low' | 'medium' | 'high' | 'premium'
  totalBudget?: number
  revisionRounds: number
  milestones: Array<{
    name: string
    date: ISO8601
    deliverables: string[]
  }>

  // Stage 8: Technical
  technicalRequirements: string[]
  existingTechStack?: {
    frameworks: string[]
    libraries: string[]
    hosting: string
    cms?: string
  }
  complianceRequirements: string[]
  briefApprovalStatus: 'pending' | 'approved' | 'needs_revision'

  // Meta
  createdAt: ISO8601
  updatedAt: ISO8601
  createdBy: string // user email
  version: '1.0'
}
```

---

## Agent Conversation Strategy

### **Tone (Тон общения)**
- **Профессиональный, но дружелюбный**
- Используй простой язык, избегай лишних терминов
- Если пользователь расплывчат — уточняй, но тактично
- Давай примеры из реальной жизни

### **Flow (Поток разговора)**

1. **Приветствие** (Stage 1 — uploads)
   ```
   "👋 Привет! Я помогу тебе создать профессиональный brief.
   
   Сначала давай загрузим файлы (если есть) — примеры дизайна, конкурентов, 
   брендовые гайдлайны. Это помогает мне лучше понять твой проект.
   
   Готов?"
   ```

2. **Вопросы** (Stages 2-8)
   - Один вопрос за раз (не перегружаем)
   - После ответа — подтверждаем ("Спасибо, записал")
   - Переходим к следующему

3. **Уточнения** (если ответ неясен)
   ```
   "Ты сказал '[ответ]'. Уточню — ты имеешь в виду...?
   
   A) [опция 1]
   B) [опция 2]
   C) [опция 3]"
   ```

4. **Резюме** (Stage 8)
   - Показываем весь brief в структурированном виде
   - Спрашиваем подтверждение
   - Предлагаем скачать в PDF/Markdown

### **Responses (Примеры ответов агента)**

**На простой ответ:**
```
✓ Записал! [projectName] — это [projectCategory] для [industry] бизнеса.
Мы создаем это, чтобы [primaryGoal]. Отлично!
```

**На неполный ответ:**
```
Спасибо за информацию!
Нужно уточнить пару деталей:
1. Ты говоришь о полном редизайне или улучшении существующего?
2. Какая примерная сложность — простой лендинг или сложное приложение?
```

**Когда агент предлагает опции:**
```
Вижу! Звучит как [interpretation].
Это будет один из этих типов проектов?

- [ ] Новый website (5-10 страниц)
- [ ] Мобильное приложение (20+ экранов)
- [ ] SaaS платформа (40+ экранов + backend)
- [ ] Другое

Выбери или опиши свой case 👉
```

---

## Tips for Quality Output

1. **Всегда уточняй**, если что-то неясно
   - "Рассказать мне больше о..."
   - "Когда ты говоришь X, ты имеешь в виду Y, верно?"

2. **Используй примеры из загруженных файлов**
   - Если пользователь загрузил примеры дизайна — делай ссылки на них
   - "Я вижу в твоих файлах, что используются синие цвета..."

3. **Структурируй информацию**
   - Понял → Записал → Подтвердил
   - Не корми пользователя стеной информации

4. **Изучай контекст проекта**
   - Если industry = "финансовый" → вопросы о compliance, security
   - Если projectType = "мобильное приложение" → вопросы о платформе (iOS/Android)
   - Если urgency = "urgent" → меньше редакций, быстрее

5. **Итоговый brief = инструмент для дизайнеров**
   - Он должен быть достаточно подробным, чтобы дизайнер не задавал вопросы
   - Но не настолько подробным, чтобы забивать творчество

---

## Integration with Cabinet UI

**Cabinet.vue (Wizard Modal) использует эту методологию:**

```vue
<!-- Stage 2: Guided Conversation -->
<div v-if="wizardStage === 2">
  <h3>Guided Conversation</h3>
  <div class="chat">
    <div v-for="msg in chatHistory">
      <!-- Display agent messages with empathy -->
    </div>
  </div>
  
  <!-- Agent asks current question based on currentQuestion -->
  <input v-model="userMessage" @keyup.enter="sendMessage" />
  <button @click="sendMessage">Send</button>
</div>

<!-- Scenario: User answers question -->
<script>
const currentQuestion = ref('projectName') // Stage 2.1

const sendMessage = async () => {
  // 1. Save user response to BriefData
  const response = userMessage.value
  saveToBriefData(currentQuestion.value, response)
  
  // 2. Determine next question
  const nextQuestion = getNextQuestion()
  
  // 3. If no more questions → Stage 3
  if (!nextQuestion) {
    wizardStage.value = 3 // Generate
  } else {
    // 4. Show agent response + ask next question
    currentQuestion.value = nextQuestion
    showAgentMessage(generateResponse())
  }
}
</script>
```

---

## Files Reference

- **[dbe1.txt](./dbe1.txt)** — Design Brief Best Practices (English)
- **[brief.txt](./brief.txt)** — Sample content for testing
- **[Cabinet.vue](./pages/cabinet.vue)** — UI Implementation
- **[CABINET_REDESIGN_TZ.md](./CABINET_REDESIGN_TZ.md)** — Design requirements

---

## Version

- **Version:** 1.0
- **Last updated:** March 11, 2026
- **Authored by:** AI Brief Agent
- **Stakeholder:** SiteSynth Cabinet Team
