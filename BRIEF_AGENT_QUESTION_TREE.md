# Brief Agent — Question Tree & Logic

Этот документ содержит **точный список вопросов**, которые агент должен задавать на каждом этапе, а также логику переходов и обработки ответов.

---

## Этап 1: Upload & File Analysis

### Вопросы и Варианты

```
┌─ STAGE_1_START
├─ Q1.1: "Какие файлы вы загружаете?"
│  └─ OPTIONS:
│     ├─ "Примеры дизайна, вдохновение"
│     ├─ "Конкурентные анализы"
│     ├─ "Существующий брендовый гайдлайн"
│     ├─ "Wireframes, прототипы"
│     ├─ "Контент, текст, описания"
│     └─ "Другое (укажите)"
│
├─ Q1.2: [AFTER FILE UPLOAD]
│  "Я проанализировал ваши файлы. Вот что я нашел:"
│  └─ SHOW:
│     ├─ Выявленные цвета (hex)
│     ├─ Шрифты (если есть)
│     ├─ Стиль / Mood (обнаруженный)
│     ├─ Ключевые сообщения из контента
│     └─ "Верно это понял? Есть корректировки?"
│
└─ NEXT: Перейти на Stage 2 (Project Overview)
```

### Data Flow

```javascript
const fileAnalysis = {
  colors: extractColors(uploadedFiles), // → colorPalette
  fonts: extractFonts(uploadedFiles),   // → typography
  mood: detectMood(uploadedFiles),      // → visualStyle
  contentThemes: extractThemes(uploadedFiles), // Context
  competitorInsights: analyzeCompetitors(uploadedFiles)
}
```

---

## Этап 2: Project Overview

### Вопросы и Варианты

```yaml
STAGE_2:
  Q2.1:
    text: "Как называется ваш проект?"
    type: text_input
    validation: min_length=3
    save_to: briefData.projectName
    example: "E-Commerce Redesign", "FinTech App", "Brand Identity" 
    agent_response: |
      ✓ Спасибо! Проект называется '{projectName}'.

  Q2.2:
    text: "В одном предложении, что вы создаете?"
    type: textarea
    validation: max_length=200
    save_to: briefData.projectDescription
    example: "Мы создаем нового веб-приложения для управления личными финансами"
    agent_response: |
      Понял! Значит, мы работаем над [{projectDescription}].
      
      [CONDITIONAL]
      if length < 30:
        clarification: |
          Давайте уточним детали:
          - Это веб-сайт, мобильное приложение или веб-приложение?
          - Для какой отрасли / типа бизнеса?
          
      if uses_vague_terms:
        clarification: |
          Ты упомянул(а) '[vagueTerm]'. Рассказать мне подробнее?
          Examples: 
          - Под "лучшим пользовательским опытом" ты имеешь в виду...?
          - Какие конкретно функции должны быть проще?

  Q2.3:
    text: "Это новый проект или переделка существующего?"
    type: single_select
    options:
      - id: "new"
        label: "Новый проект"
        follow_up: "Интересно, вы планируете с нуля?"
      - id: "redesign"
        label: "Редизайн/улучшение существующего"
        follow_up: "Понял! Что вас не устраивает в текущем варианте?"
      - id: "expansion"
        label: "Расширение текущего"
        follow_up: "Какие новые функции нужны?"
      - id: "migration"
        label: "Миграция на новую платформу"
        follow_up: "Откуда переезжаете и куда?"
    save_to: briefData.projectType

  Q2.4:
    text: "Какой тип проекта?"
    type: single_select
    options:
      - id: "website"
        label: "Website / Landing page"
        estimated_pages: "5-20"
        complexity: "Low-Medium"
      - id: "mobile_app"
        label: "Мобильное приложение"
        estimated_screens: "15-40+"
        complexity: "Medium-High"
      - id: "web_app"
        label: "Веб-приложение / SaaS"
        estimated_screens: "20-100+"
        complexity: "High"
      - id: "branding"
        label: "Branding / Brand Identity"
        includes: ["Logo", "Brand Guide", "Visual System"]
        complexity: "Medium"
      - id: "ecommerce"
        label: "E-commerce платформа"
        estimated_pages: "20-50+"
        complexity: "High"
      - id: "other"
        label: "Другое"
        ask: "Расскажите подробнее"
    save_to: briefData.projectCategory

  Q2.5:
    text: "В какой отрасли вы работаете? / Кто ваша компания?"
    type: text_input
    examples: "FinTech, Healthcare, E-commerce, Education, консалтинг"
    save_to: 
      - briefData.industry
      - briefData.companyDescription

STAGE_2_END:
  agent_summary: |
    Отлично! Вот что я записал:
    
    📋 **Проект: {projectName}**
    • Описание: {projectDescription}
    • Тип: {projectType} (новый/редизайн/...)
    • Категория: {projectCategory} (website/app/...)
    • Отрасль: {industry}
    
    Переходим дальше? Сейчас соберем информацию о целях и аудитории.
```

### Логика и Условия

```javascript
// Если projectCategory = "mobile_app"
if (briefData.projectCategory === 'mobile_app') {
  // Добавить дополнительный вопрос
  addQuestion({
    id: "Q2.5_Platform",
    text: "Какие платформы нужны?",
    options: ["iOS", "Android", "Both"]
  })
}

// Если projectType = "redesign"
if (briefData.projectType === 'redesign') {
  // Добавить вопрос о существующем проекте
  addQuestion({
    id: "Q2.3_Existing",
    text: "Можете описать текущее решение?"
  })
}

// Если ответ слишком расплывчатый
if (userMessage.length < 20 || containsVagueWords(userMessage)) {
  showClarification("Мне нужно больше деталей...")
}
```

---

## Этап 3: Project Goals

### Вопросы и Варианты

```yaml
STAGE_3:
  Q3.1:
    text: "Какова ГЛАВНАЯ цель этого проекта?"
    type: single_select
    options:
      - id: "increase_conversion"
        label: "Увеличить конверсию / продажи"
        followup: "На сколько процентов вы хотите увеличить конверсию?"
      - id: "improve_ux"
        label: "Улучшить пользовательский опыт"
        followup: "Какая главная проблема с текущим UX?"
      - id: "launch_product"
        label: "Запустить новый продукт / услугу"
        followup: "Расскажите о продукте (суть, аудитория)"
      - id: "increase_traffic"
        label: "Увеличить трафик / видимость"
        followup: "Какая целевая аудитория для трафика?"
      - id: "rebrand"
        label: "Переребрандирование / изменение имиджа"
        followup: "Что должна передать новая визуальность?"
      - id: "migrate_platform"
        label: "Миграция на новую платформу"
        followup: "С какой платформы на какую?"
      - id: "cost_reduction"
        label: "Снизить затраты / оптимизировать"
        followup: "Какие затраты нужно снизить?"
      - id: "compliance"
        label: "Соответствие требованиям (GDPR, WCAG и т.д.)"
        followup: "Какие требования нужно соблюсти?"
    save_to: briefData.primaryGoal
    agent_response: "Понял! Главная цель — {primaryGoal}."

  Q3.2:
    text: "Какие конкретные ПРОБЛЕМЫ вы решаете?"
    type: textarea
    hint: "Напишите 3-5 проблем, которые должен решить этот проект"
    examples:
      - "Пользователи не могут быстро найти нужный продукт"
      - "Процесс оформления заказа занимает более 5 минут"
      - "Мобильная версия работает медленно"
      - "Нет интеграции с платежными системами"
    validation: |
      - min_items: 1
      - max_items: 10
      - strip_duplicates: true
    save_to: briefData.problemsToSolve (array)
    agent_response: |
      Вижу! Нам нужно решить эти проблемы:
      1. {problem1}
      2. {problem2}
      3. {problem3}
      
      Это хороший список для дизайнеров.

  Q3.3:
    text: "Как вы будете ИЗМЕРЯТЬ успех?"
    hint: "Какие метрики покажут, что проект удался?"
    type: checkbox_multiple
    options:
      - id: "traffic"
        label: "Увеличение трафика на +X%"
        input: "На сколько процентов? (e.g., 50%)"
      - id: "conversion"
        label: "Увеличение конверсии на +X%"
        input: "На сколько процентов? (e.g., 25%)"
      - id: "reduce_bounces"
        label: "Снижение bounce rate на X%"
        input: "На сколько процентов? (e.g., 15%)"
      - id: "avg_order"
        label: "Увеличение среднего заказа на X$"
        input: "На сколько? (e.g., $50)"
      - id: "user_engagement"
        label: "Увеличение user engagement (X часов/день)"
        input: "Целевое значение?"
      - id: "nps"
        label: "Улучшение NPS на X пунктов"
        input: "На сколько пунктов? (e.g., +10)"
      - id: "performance"
        label: "Lighthouse score X+"
        input: "Целевой score? (80-100)"
      - id: "retention"
        label: "Увеличение retention rate на X%"
        input: "На сколько процентов?"
      - id: "custom"
        label: "Своя метрика"
        input: "Опишите метрику"
    validation: "min_selections: 1"
    save_to: briefData.successMetrics (array of {metric, target})

  Q3.4:
    text: "Есть ли ОГРАНИЧЕНИЯ или РИСКИ, о которых мы должны знать?"
    type: textarea
    hint: "Бюджет, сроки, технические ограничения, legal issues, конкуренция и т.д."
    examples:
      - "Нельзя трогать существующих клиентов сайта"
      - "Бюджет строго ограничен: max $5000"
      - "Требования банка по безопасности: PCI DSS Level 2"
      - "Конкурент готов запустить аналогичный продукт через месяц"
      - "Есть legacy система, интегрироваться с которой сложно"
    save_to: briefData.constraints (array)

  Q3.5:
    text: "Кто основной STAKEHOLDER / принимает решения?"
    type: text_input
    format: "Имя (или должность), контакт (опционально)"
    example: "Иван Петров, CEO; ivan@company.com"
    save_to: briefData.primaryStakeholder
    agent_response: |
      Спасибо! {stakeholder} — главный decision maker.
      Если потребуется одобрение, я свяжусь с ним.

STAGE_3_END:
  agent_summary: |
    Отлично! Я записал цели вашего проекта:
    
    🎯 **ЦЕЛЕВОЕ СОСТОЯНИЕ:**
    • Главная цель: {primaryGoal}
    • Решаемые проблемы: {problemsToSolve}
    • Метрики успеха: {successMetrics}
    • Ограничения: {constraints}
    • Decision maker: {primaryStakeholder}
    
    Это четкое направление для дизайного процесса.
    Переходим к аудитории — на кого мы ориентируемся?
```

---

## Этап 4: Target Audience

### Вопросы и Варианты

```yaml
STAGE_4:
  Q4.1:
    text: "КТО ваша основная целевая аудитория?"
    hint: "Кто будет использовать этот продукт?"
    type: text_input
    examples:
      - "Собственники малого бизнеса 25-45 лет"
      - "IT-инженеры, которые хотят учиться новым технологиям"
      - "Женщины 30-55 лет, ищущие профессиональную одежду"
      - "Компании с выручкой 1-10 млн в год"
    validation: "length > 10"
    save_to: briefData.primaryPersona.name
    agent_response: "Спасибо! Основная аудитория — {persona}."

  Q4.2:
    text: "Переформулирую для ясности. Это правда?"
    type: confirmation
    prompt: |
      Ваша аудитория:
      • Возраст: примерно {age_inferred}?
      • Раздел: {gender_inferred}?
      • Уровень дохода: {income_inferred}?
      • Тип работы: {job_type_inferred}?
      
      ☑️ Да, верно!
      ❌ Нет, поправить
    conditional_next: |
      if (confirmed) → proceed_to_Q4.3
      else → ask_details_q4.2_detailed

  Q4.2_detailed:
    text: "Давайте уточним детали вашей аудитории"
    type: form
    fields:
      - name: "age_range"
        label: "Возрастной диапазон (от-до)"
        type: "number_range"
        example: "25-45"
      - name: "gender"
        label: "Пол"
        type: "single_select"
        options: ["Мужской", "Женский", "Все равно"]
      - name: "income_level"
        label: "Уровень дохода"
        type: "single_select"
        options: ["Низкий (< $30k/год)", "Средний ($30-75k)", "Высокий (> $75k)"]
      - name: "education"
        label: "Образование"
        type: "single_select"
        options: ["Среднее", "Бакалавр", "Магистр+"]
      - name: "location"
        label: "Географическая область"
        type: "text_input"
        example: "Россия, Украина, или Европа"
      - name: "job_type"
        label: "Тип работы / занятости"
        type: "text_input"
        example: "Фрилансеры, сотрудники офиса, бизнесмены"
    save_to: briefData.primaryPersona.demographics

  Q4.3:
    text: "Какие БОЛИ / ПРОБЛЕМЫ у этой аудитории?"
    hint: "Что их раздражает? Что они хотят улучшить?"
    type: textarea
    examples:
      - "Нет времени на ручной учет финансов"
      - "Сложно найти нужный товар в каталоге"
      - "Платят слишком много за текущее решение"
      - "Нет интеграции между разными инструментами"
    validation: "min_length: 20"
    save_to: briefData.primaryPersona.painPoints (array)

  Q4.4:
    text: "КАК они сейчас используют подобные продукты? Какой девайс основной?"
    type: single_select
    options:
      - id: "mobile_first"
        label: "🔴 МОБИЛЬНЫЙ первым (всегда в дороге)"
        design_implication: "Mobile-first дизайн, быстрые интеракции"
      - id: "desktop_focused"
        label: "💻 ДЕСКТОП основной (офис, работа)"
        design_implication: "Desktop-focused, больше возможностей"
      - id: "mixed"
        label: "⚖️ ОБА одинаково (дома и в офисе)"
        design_implication: "Responsive, работает везде"
    save_to: briefData.primaryPersona.devicePreference

  Q4.5:
    text: "Есть ли еще ВТОРИЧНЫЕ personas (аудитория), которые важны?"
    hint: "Например, не только конечные пользователи, но и админы, модераторы и т.д."
    type: single_select
    options:
      - id: "no"
        label: "Нет, только одна основная"
        next: STAGE_4_END
      - id: "yes"
        label: "Да, есть еще (1-2)"
        next: "Repeat Q4.1-Q4.4 for secondary persona"
      - id: "multiple"
        label: "Да, много (3+)"
        next: "Ask for top 3 personas"

STAGE_4_END:
  agent_summary: |
    Спасибо! Теперь я знаю вашу аудиторию:
    
    👥 **PRIMARY PERSONA: {persona_name}**
    • Возраст: {age}
    • Пол: {gender}
    • Доход: {income}
    • Основной девайс: {device}
    • Боли: {painPoints}
    
    [if secondaryPersonas exist]
    👥 **SECONDARY PERSONAS:**
    - {persona2}
    - {persona3}
    
    Это критично для дизайна — все будет ориентировано на эту аудиторию!
    Переходим к бренду и стилю вашего проекта?
```

---

## Этап 5: Brand Guidelines

### Вопросы и Варианты

```yaml
STAGE_5:
  Q5.1:
    text: "Есть ли уже establecido БРЕНДОВЫЙ ГАЙДЛАЙН?"
    type: single_select
    options:
      - id: "exists"
        label: "Да, есть готовый (загрузили в файлах)"
        action: "Use colors/fonts from Stage 1 analysis"
        proceed: "Подтвердить цвета и шрифты"
      - id: "partial"
        label: "Есть отчасти (только логотип или цвета)"
        action: "Ask for missing pieces"
      - id: "none"
        label: "Нет, создаем с нуля"
        action: "Full brand questionnaire"
    save_to: briefData.brandGuidelineStatus

  Q5.2:
    text: "Какие ОСНОВНЫЕ ЦВЕТА вашего бренда?"
    type: color_picker (multiple)
    hint: "Выберите 3-5 основных цветов (hex формат)"
    template:
      - label: "Первичный цвет"
        usage: "CTA buttons, links, accents"
      - label: "Вторичный цвет"
        usage: "Backgrounds, secondary elements"
      - label: "Акцентный цвет"
        usage: "Alerts, warnings, highlights"
      - label: "Нейтральный (текст)"
        usage: "Body text, neutral backgrounds"
    example: |
      Primary: #0033FF (Blue)
      Secondary: #8D35FF (Purple)
      Accent: #FF5733 (Red/Orange)
      Neutral: #333333 (Dark Gray)
    save_to: briefData.colorPalette (array)
    agent_response: |
      Отлично! Ваша палитра:
      • Первичный: {hex1}
      • Вторичный: {hex2}
      • Акцент: {hex3}
      
      Это создает очень четкую визуальную иерархию.

  Q5.3:
    text: "Какие ШРИФТЫ / ТИПОГРАФИЯ?"
    type: form
    fields:
      - name: "heading_font"
        label: "Шрифт для заголовков"
        type: "text_input"
        examples: "Montserrat, Playfair Display, Arial Black, Roboto Bold"
      - name: "body_font"
        label: "Шрифт для основного текста"
        type: "text_input"
        examples: "Inter, Roboto, Open Sans, Lato"
      - name: "accent_font"
        label: "Шрифт для акцентов (optional)"
        type: "text_input"
        examples: "Playfair Display, Raleway, Poppins"
    save_to: briefData.typography (array)

  Q5.4:
    text: "Какой TONE OF VOICE (как вы говорите с аудиторией)?"
    type: single_select
    options:
      - id: "professional"
        label: "🎩 Профессиональный и формальный"
        example: "Мы предлагаем комплексные решения для вашего бизнеса"
      - id: "friendly"
        label: "😊 Дружелюбный и casual"
        example: "Давайте вместе сделаем ваш бизнес крутым!"
      - id: "innovative"
        label: "⚡ Энергичный и инновационный"
        example: "Рев технологии, которая меняет индустрию"
      - id: "conservative"
        label: "🛡️ Консервативный и надежный"
        example: "30 лет опыта, надежное решение для вас"
      - id: "educational"
        label: "📚 Образовательный"
        example: "Давайте разбираться вместе, шаг за шагом"
      - id: "custom"
        label: "Свой вариант"
        input: "Опишите"
    save_to: briefData.toneOfVoice
    agent_response: |
      Звучит как {tone_description} подход.
      Все копирайтинг и коммуникация будет в этом стиле.

  Q5.5:
    text: "Какое ГЛАВНОЕ СООБЩЕНИЕ / СЛОГАН вашего бренда?"
    type: textarea
    hint: "Ваша миссия, главное обещание, elevator pitch"
    examples:
      - "Мы делаем финансы простыми"
      - "Ваш здоровый выбор каждый день"
      - "Технология, которая работает для вас"
    validation: "max_length: 150"
    save_to: briefData.brandMessage

STAGE_5_END:
  agent_summary: |
    Спасибо! Ваш бренд:
    
    🎨 **БРЕНДОВАЯ ИДЕНТИЧНОСТЬ**
    • Первичный цвет: {color1_hex} ({color1_name})
    • Вторичный: {color2_hex} ({color2_name})
    • Шрифты: {heading_font} (заголовки) + {body_font} (текст)
    • Tone: {tone_of_voice}
    • Сообщение: "{brandMessage}"
    
    Это очень четкие брендовые рамки. Дизайнеры будут работать именно в этом стиле.
    Переходим к конкретным DELIVERABLES?
```

---

## Этап 6: Deliverables (Что создаем)

### Вопросы и Варианты

```yaml
STAGE_6:
  Q6.1:
    text: "Какие конкретные DELIVERABLES нужны? (выберите все)"
    type: checkbox_multiple
    options:
      - id: "wireframes"
        label: "□ Wireframes (low-fidelity sketches)"
        description: "Черновые эскизы структуры страниц (B&W)"
      - id: "mockups"
        label: "□ Mockups (static high-fidelity designs)"
        description: "Полноценные дизайны с цветами и деталями"
      - id: "prototypes"
        label: "□ Interactive prototypes (Figma/XD)"
        description: "Кликабельные прототипы с анимациями"
      - id: "brand_guide"
        label: "□ Brand guidelines document"
        description: "PDF документ с брендовыми правилами"
      - id: "design_system"
        label: "□ Design system / component library"
        description: "Переиспользуемые компоненты и паттерны"
      - id: "specs"
        label: "□ Developer handoff specs"
        description: "Техспецификации (размеры, цвета, шрифты)"
      - id: "user_flows"
        label: "□ User flows / Information architecture"
        description: "Диаграммы пути пользователя"
      - id: "responsive"
        label: "□ Responsive design"
        description: "Макеты для мобильных + таблетов + десктопа"
      - id: "animations"
        label: "□ Animation/Micro-interaction specs"
        description: "Спецификации для анимаций и переходов"
      - id: "content"
        label: "□ Content strategy / copywriting"
        description: "Тексты и структура контента"
    validation: "min_selections: 1"
    save_to: briefData.deliverables (array)
    agent_response: |
      Понял! Нам нужно создать:
      • {deliverable1}
      • {deliverable2}
      • {deliverable3}
      
      Это хороший список. Переходим к деталям?

  Q6.2:
    text: "Если RESPONSIVE дизайн — какие BREAKPOINTS?"
    conditional: "if 'responsive' in deliverables"
    type: form
    fields:
      - name: "mobile_sizes"
        label: "Мобильные (выберите)"
        type: "checkbox"
        options: ["375px (iPhone SE)", "414px (iPhone 11)", "другое"]
      - name: "tablet_sizes"
        label: "Таблеты (выберите)"
        type: "checkbox"
        options: ["768px (iPad)", "834px (iPad Pro)", "другое"]
      - name: "desktop_sizes"
        label: "Десктопы (выберите)"
        type: "checkbox"
        options: ["1440px (standard)", "1920px (wide)", "другое"]
    save_to: briefData.breakpoints

  Q6.3:
    text: "Сколько СТРАНИЦ / ЭКРАНОВ приблизительно?"
    type: number_input
    placeholder: "10"
    hint: "Сайт: 5-20, App: 10-40, SaaS: 40-100"
    example_suggestions:
      if projectCategory === "website": "типично 8-15 страниц"
      if projectCategory === "mobile_app": "типично 20-40 экранов"
      if projectCategory === "web_app": "типично 30-80 экранов"
    save_to: briefData.pageCount
    follow_up: |
      {pageCount} экранов — это хороший объем работы.
      Давайте уточним СТРУКТУРУ?

  Q6.4:
    text: "Какая СТРУКТУРА / SITEMAP вам нужна?"
    type: textarea
    hint: "Напишите иерархию страниц (используйте - для отступов)"
    example: |
      - Home
      - About
      - Services
        - Service 1
        - Service 2
        - Service 3
      - Team
      - Case Studies
      - Blog
      - Contact
      - Privacy Policy
    validation: "min_lines: 5"
    save_to: briefData.sitemap

  Q6.5:
    text: "Есть ли СПЕЦИФИЧЕСКИЕ ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ?"
    type: textarea
    hint: "Фильтры, поиск, драг-дроп, модали, анимации и т.д."
    examples:
      - "Поиск с автодополнением"
      - "Фильтры товаров (по цене, размеру и т.д.)"
      - "Модальное окно для очень важного контента"
      - "Drag-and-drop для переупорядочивания"
      - "Real-time уведомления"
      - "Infinite scroll или pagination"
    save_to: briefData.interactiveFeatures (array)

STAGE_6_END:
  agent_summary: |
    Отлично! Ваши DELIVERABLES:
    
    📦 **ЧТО СОЗДАЕМ**
    • {deliverable1}, {deliverable2}, {deliverable3}
    • Страниц/экранов: {pageCount}
    • Breakpoints: {breakpoints}
    • Структура: {sitemap_summary} ({num_of_top_level} разделов)
    • Специальные интерактивы: {interactiveFeatures}
    
    Это четкий список работ. Переходим к СРОКАМИ и БЮДЖЕТУ?
```

---

## Этап 7: Timeline & Budget

### Вопросы и Варианты

```yaml
STAGE_7:
  Q7.1:
    text: "Когда нужен ФИНАЛЬНЫЙ результат?"
    type: date_picker
    hint: "Укажите дату дедлайна"
    today: "2026-03-11"
    example: "2026-04-15"
    save_to: briefData.deadline
    follow_up: |
      Дедлайн: {deadline} ({days_from_now} дней).
      Это {urgency} временной фрейм.

  Q7.1_alternative:
    text: "Или укажите в НЕДЕЛЯХ"
    type: number_input
    placeholder: "4"
    calculation: "today + weeks * 7 days"
    save_to: briefData.deadline

  Q7.2:
    text: "Это срочный проект или спокойный?"
    type: single_select
    options:
      - id: "urgent"
        label: "🔴 СРОЧНЫЙ (1-2 недели)"
        implication: "Минимум итераций, быстрая работа"
      - id: "normal"
        label: "🟡 ОБЫЧНЫЙ (2-4 недели)"
        implication: "Стандартный цикл feedback"
      - id: "relaxed"
        label: "🟢 СПОКОЙНЫЙ (4+ недель)"
        implication: "Много времени на polish и доработки"
    save_to: briefData.urgency
    conditional_adjust: |
      if urgency === "urgent":
        suggest_less_revisions()
      if urgency === "relaxed":
        suggest_more_iterations()

  Q7.3:
    text: "Какой БЮДЖЕТ вы готовы выделить?"
    type: single_select
    options:
      - id: "low"
        label: "$500-2000"
        note: "Минимальный, простые проекты"
      - id: "medium"
        label: "$2000-5000"
        note: "Средний, хороший уровень"
      - id: "high"
        label: "$5000-15000"
        note: "Полный цикл, детальный дизайн"
      - id: "premium"
        label: "$15000+"
        note: "Premium, сложные системы"
      - id: "custom"
        label: "Свой бюджет"
        input: "Укажите сумму в $"
    save_to: briefData.budgetRange

  Q7.4:
    text: "Сколько РАУНДОВ РЕДАКЦИИ вы ожидаете?"
    type: single_select
    options:
      - id: "one"
        label: "1 раунд (только финал)"
        practical: "Very limited feedback time"
      - id: "two"
        label: "2 раунда (draft + final)"
        practical: "Good for most projects"
      - id: "three_five"
        label: "3-5 раундов"
        practical: "Full collaborative process"
      - id: "unlimited"
        label: "Unlimited (до результата)"
        practical: "Takes more time"
    save_to: briefData.revisionRounds

  Q7.5:
    text: "Есть ли ПРОМЕЖУТОЧНЫЕ MILESTONES / CHECKPOINTS?"
    type: textarea
    hint: "Напишите ключевые моменты в проекте (опционально)"
    examples:
      - "Week 1: Wireframes готовы"
      - "Week 2: Первые мокапы на feedback"
      - "Week 3: Финальные версии дизайна"
    conditional: "optional"
    save_to: brief Data.milestones (array)

STAGE_7_END:
  agent_summary: |
    Спасибо! Вот СРОКИ и БЮДЖЕТ:
    
    ⏰ **TIMELINE**
    • Дедлайн: {deadline} ({days_from_now} дней)
    • Срочность: {urgency}
    • Раундов редакции: {revisionRounds}
    [if milestones exist]
    • Milestones: {milestones}
    
    💰 **БЮДЖЕТ**
    • Диапазон: {budgetRange}
    
    Это поможет спланировать работу и исходные ресурсы.
    Осталось собрать ТЕХНИЧЕСКИЕ требования?
```

---

## Этап 8: Technical Requirements & Final Review

### Вопросы и Варианты

```yaml
STAGE_8:
  Q8.1:
    text: "Какие ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ / ОГРАНИЧЕНИЯ?"
    type: checkbox_multiple
    options:
      - id: "browser_compat"
        label: "□ Browser compatibility"
        input: "Какие браузеры? (Chrome, Safari, Firefox, IE...)"
      - id: "accessibility"
        label: "□ Accessibility (WCAG, A11y)"
        input: "Уровень? (A, AA, AAA)"
      - id: "performance"
        label: "□ Performance requirements"
        input: "Lighthouse score? (e.g., 80+)"
      - id: "seo"
        label: "□ SEO requirements"
        input: "Основные требования?"
      - id: "integration"
        label: "□ API / Backend integration"
        input: "Какие интеграции?"
      - id: "cms"
        label: "□ CMS requirement"
        input: "Какой CMS? (WordPress, Webflow, Custom...)"
      - id: "localization"
        label: "□ Multi-language support"
        input: "Какие языки?"
      - id: "compliance"
        label: "□ Compliance/Legal"
        input: "GDPR, CCPA, Privacy Policy...?"
    save_to: briefData.technicalRequirements (array)

  Q8.2:
    text: "Есть ли уже СУЩЕСТВУЮЩАЯ ТЕХНИЧЕСКАЯ АРХИТЕКТУРА?"
    type: single_select
    options:
      - id: "new"
        label: "Нет, создаем с нуля"
        prompt: "Какой технологический стек вы предпочитаете?"
      - id: "exists"
        label: "Да, есть существующая"
        prompt: |
          Пожалуйста, опишите:
          - Current frameworks/libraries?
          - Hosting/Infrastructure?
          - Database?
    save_to: briefData.existingTechStack

  Q8.3:
    text: "Финальная ПРОВЕРКА — все ли верно?"
    type: confirmation
    show_full_brief: true
    brief_template: |
      ┌────────────────────────────────────────────┐
      │          📋 ФИНАЛЬНЫЙ BRIEF 📋             │
      └────────────────────────────────────────────┘
      
      ▪️ ПРОЕКТ
      Название: {projectName}
      Описание: {projectDescription}
      Тип: {projectType}
      Категория: {projectCategory}
      Отрасль: {industry}
      
      ▪️ ЦЕЛИ & ЗАДАЧИ
      Главная цель: {primaryGoal}
      Проблемы: {problemsToSolve}
      Success metrics: {successMetrics}
      Ограничения: {constraints}
      Stakeholder: {primaryStakeholder}
      
      ▪️ АУДИТОРИЯ
      Primary persona: {persona_name}
      Демография: {age}, {gender}, {income}
      Боли: {painPoints}
      Девайс: {devicePreference}
      [Secondary personas]: {secondaryPersonas}
      
      ▪️ БРЕНД
      Цвета: {colorPalette}
      Шрифты: {typography}
      Tone: {toneOfVoice}
      Сообщение: {brandMessage}
      
      ▪️ DELIVERABLES
      Типы: {deliverables}
      Страниц/экранов: {pageCount}
      Структура: {sitemap}
      Интерактивы: {interactiveFeatures}
      Breakpoints: {breakpoints}
      
      ▪️ TIMELINE & BUDGET
      Дедлайн: {deadline} ({urgency})
      Бюджет: {budgetRange}
      Редакции: {revisionRounds}
      Milestones: {milestones}
      
      ▪️ ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ
      Requirements: {technicalRequirements}
      Tech stack: {existingTechStack}
      
      ✅ Все верно?
    options:
      - id: "approve"
        label: "✓ Да, все правильно!"
        action: "Proceed to generate brief"
      - id: "changes"
        label: "✗ Нет, нужны исправления"
        action: "Ask what to change"

  Q8.3_changes:
    text: "ЧТО нужно изменить или уточнить?"
    type: textarea
    hint: "Напишите, какие изменения нужны (можно по пунктам)"
    example: |
      - Цвет: нужен более светлый оттенок синего
      - Сроки: дедлайн перенести на неделю позже
      - Добавить persona для админов
    action: |
      1. Update only mentioned fields in briefData
      2. Show updated brief again
      3. Ask confirmation again

STAGE_8_END:
  if (briefApprovalStatus === 'approved'):
    action: |
      1. Save brief to database
      2. Generate PDF/Markdown export
      3. Move to Stage 3 (Generate)
      4. Show success message
    success_message: |
      🎉 **BRIEF СОХРАНЕН!**
      
      Ваш brief готов и сохранен в системе.
      Файлы:
      • Brief_{projectName}_{timestamp}.pdf
      • Brief_{projectName}_{timestamp}.md
      
      Дизайнеры начнут работу на основе этого brief.
      Спасибо за сотрудничество! 🚀
  
  else:
    action: |
      1. Repeat confirmation with updated brief
      2. Allow more changes until approved

```

---

## Error Handling & Edge Cases

### Неполные ответы

```javascript
if (userResponse.length < MIN_LENGTH || containsVaguePhrases(userResponse)) {
  agentResponse = `
    Спасибо за ответ!
    Но нужно немного разъяснить:
    
    Ты написал(а): "${userResponse}"
    
    Скажи мне подробнее:
    • ${clarificationQuestion1}?
    • ${clarificationQuestion2}?
    • ${clarificationQuestion3}?
    
    Любой из этих вариантов поможет мне лучше понять твой проект.
  `
  reprompt()
}
```

### Скачки в данных

```javascript
// Если пользователь вернулся на предыдущий этап —
// показываем уже заполненные данные

if (goingBack) {
  loadSavedDataForStage(previousStage)
  showMessage(`
    Вернули данные, которые ты уже ввел(а):
    
    ${displaySavedData}
    
    Что требует изменения?
  `)
}
```

### Противоречивые данные

```javascript
// Если есть конфликт: deadline слишком короткий,
// но много deliverables

if (conflictDetected(deadline, pageCount, revisionRounds)) {
  warnUser(`
    ⚠️ ПОТЕНЦИАЛЬНАЯ ПРОБЛЕМА:
    
    Дедлайн: {deadline} ({daysRemaining} дней)
    Работ: {pageCount} экранов
    Редакции: {revisionRounds} раундов
    
    Это очень амбициозно. Рекомендую:
    • Уменьшить количество страниц ДО {adjusted_pageCount}
    • Или увеличить дедлайн НА {adjusted_days} дней
    • Или уменьшить редакции ДО {adjusted_revisions}
    
    Как лучше?
  `)
}
```

---

## Integration with Node.js Backend

Эти вопросы должны обрабатываться с помощью API:

```typescript
// Типовой endpoint для сохранения brief
POST /api/briefs
{
  "briefData": BriefData,
  "userEmail": string,
  "status": "draft" | "approved"
}

// Загрузка файлов
POST /api/upload
{
  "file": File,
  "analysis_type": "color" | "font" | "content"
}

// Получение brief
GET /api/briefs/:briefId

// Обновление brief
PUT /api/briefs/:briefId
{
  "updates": Partial<BriefData>
}
```

---

**Версия:** 1.0  
**Дата:** March 11, 2026  
**Автор:** Brief Agent Methodology Team
