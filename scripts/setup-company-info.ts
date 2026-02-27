/**
 * Script to create CompanyInfo table in NocoBase and populate it with SiteSynth data
 * Run with: npx tsx scripts/setup-company-info.ts
 */

const NOCO_BASE_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
const NOCO_TOKEN = process.env.NOCO_TOKEN

const COMPANY_DATA = [
  // Services
  {
    key: 'service_branding',
    value: 'Brand-Driven Product Strategy - Мы помогаем определить стратегию вашего продукта, его позиционирование на рынке и план выхода на рынок (go-to-market). Идеально для стартапов, готовых к масштабированию.',
    category: 'services',
    active: true,
  },
  {
    key: 'service_design',
    value: 'UX & Design Systems - Создаем масштабируемые дизайн-системы и компонентные библиотеки. Наш подход объединяет стратегию, юзабилити и современную эстетику. Работаем с Figma, Tailwind и современными инструментами.',
    category: 'services',
    active: true,
  },
  {
    key: 'service_development',
    value: 'Full-Stack Development - Полная разработка от фронтенда до бэкенда, баз данных, развертывания и DevOps. Используем Vue 3, React, Node.js, Nuxt, Supabase и другие современные технологии.',
    category: 'services',
    active: true,
  },
  {
    key: 'service_ai',
    value: 'AI-Powered Workflows - Интеграция AI в ваши процессы и автоматизация. От AI-чат-ботов до аналитических инструментов с Claude, GPT и Gemini. Помогаем компаниям использовать AI для улучшения продуктов.',
    category: 'services',
    active: true,
  },

  // Pricing
  {
    key: 'pricing_intro',
    value: 'Ценообразование зависит от сложности и масштаба проекта. Мы работаем как с молодыми стартапами, так и с крупными компаниями. Каждый проект уникален, поэтому мы готовим индивидуальные предложения.',
    category: 'pricing',
    active: true,
  },
  {
    key: 'pricing_consultation',
    value: 'Консультация: от $500 - помощь в определении стратегии, выбора технологического стека, архитектуры и плана развития продукта.',
    category: 'pricing',
    active: true,
  },
  {
    key: 'pricing_design',
    value: 'Дизайн & UX: от $5000 - создание пользовательского интерфейса, дизайн-системы, редизайн существующего интерфейса. Включает прототипирование и тестирование.',
    category: 'pricing',
    active: true,
  },
  {
    key: 'pricing_development',
    value: 'Full-Stack Development: от $10000 - полная разработка веб или мобильного приложения с нашей командой опытных разработчиков.',
    category: 'pricing',
    active: true,
  },
  {
    key: 'pricing_ai_integration',
    value: 'AI Integration: от $3000 - добавление AI-функциональности в ваш продукт (чат-боты, анализ данных, автоматизация).',
    category: 'pricing',
    active: true,
  },
  {
    key: 'pricing_note',
    value: 'Для получения точной цены на ваш проект, заполните форму intake на нашем сайте. Наша команда свяжется с вами в течение 24 часов с детальным предложением.',
    category: 'pricing',
    active: true,
  },

  // Process
  {
    key: 'process_intro',
    value: 'Наш процесс работы разделен на 5 этапов. Каждый этап включает регулярное взаимодействие с клиентом и демонстрацию прогресса.',
    category: 'process',
    active: true,
  },
  {
    key: 'process_step1',
    value: '1. Discovery & Planning - Заполняете форму intake (5-10 минут). Мы изучаем ваш проект, цели, бюджет, сроки и требования. Затем готовим детальное предложение.',
    category: 'process',
    active: true,
  },
  {
    key: 'process_step2',
    value: '2. Proposal & Agreement - Представляем детальное предложение с смета, сроками и контрактом. Обсуждаем все детали, согласовываем нюансы.',
    category: 'process',
    active: true,
  },
  {
    key: 'process_step3',
    value: '3. Kick-off Meeting - Встреча с полной командой проекта. Обсуждаем детали, устанавливаем коммуникационные каналы, запускаем работу.',
    category: 'process',
    active: true,
  },
  {
    key: 'process_step4',
    value: '4. Development & Reviews - Еженедельные синхронизации, еженедельные демо, обратная связь. Доступ к GitHub, Figma и всем проектным инструментам.',
    category: 'process',
    active: true,
  },
  {
    key: 'process_step5',
    value: '5. Launch & Support - Запуск продукта, обучение команды, постоянная техническая поддержка в течение согласованного периода.',
    category: 'process',
    active: true,
  },

  // FAQ
  {
    key: 'faq_timeline',
    value: 'Q: Сколько времени занимает проект? A: Консультация - 1-3 дня, дизайн - 2-4 недели, разработка - 1-3 месяца (в зависимости от сложности). AI-интеграция обычно быстрее - 1-2 недели.',
    category: 'faq',
    active: true,
  },
  {
    key: 'faq_team',
    value: 'Q: Кто будет работать над моим проектом? A: Команда опытных специалистов - дизайнеры (5+ лет опыта), разработчики (5+ лет), PM и QA. Все члены команды прошли тщательный отбор.',
    category: 'faq',
    active: true,
  },
  {
    key: 'faq_communication',
    value: 'Q: Как часто мы будем общаться? A: Еженедельные синхронизации (Zoom/Meet), ежедневные обновления в Slack, доступ к GitHub и Figma в реальном времени, еженедельные демо.',
    category: 'faq',
    active: true,
  },
  {
    key: 'faq_revision',
    value: 'Q: Включены ли правки? A: Да. В контракте указано количество раундов правок (обычно 2-3). Дополнительные правки оплачиваются согласно нашему Rate Card.',
    category: 'faq',
    active: true,
  },
  {
    key: 'faq_tech',
    value: 'Q: Какие технологии вы используете? A: Vue 3, React, Node.js, Nuxt, TypeScript, TailwindCSS, Supabase, PostgreSQL, AWS, Google Cloud, Claude AI, GPT. Выбираем best-of-breed для каждого проекта.',
    category: 'faq',
    active: true,
  },
  {
    key: 'faq_maintenance',
    value: 'Q: Предоставляете ли вы поддержку после запуска? A: Да. Мы предоставляем техническую поддержку в течение согласованного периода (обычно 3-6 месяцев). Далее возможна контрактная поддержка.',
    category: 'faq',
    active: true,
  },

  // About
  {
    key: 'about_intro',
    value: 'SiteSynth - это консультанция и product studio на пересечении дизайна, разработки и AI. Мы помогаем компаниям создавать продукты, которые люди любят использовать.',
    category: 'about',
    active: true,
  },
  {
    key: 'about_expertise',
    value: 'Наша экспертиза: Product Strategy, UX/UI Design, Full-Stack Development, AI Integration. Мы работали с стартапами (от идеи до Series A) и крупными компаниями (Fortune 500).',
    category: 'about',
    active: true,
  },
  {
    key: 'about_values',
    value: 'Наши ценности: Quality over quantity, Transparency, Client Success, Innovation, Continuous Learning. Мы верим в долгосрочные партнерства, а не в разовые проекты.',
    category: 'about',
    active: true,
  },
]

async function setupCompanyInfo() {
  try {
    console.log('🚀 Начинаем создание таблицы CompanyInfo...')

    // Step 1: Get projects to find default project
    console.log('📋 Получаем информацию о проектах...')
    const projectsUrl = `${NOCO_BASE_URL}/api/v1/db/meta/projects`
    const projectsRes = await fetch(projectsUrl, {
      headers: {
        'xc-auth': NOCO_TOKEN,
      },
    })

    if (!projectsRes.ok) {
      throw new Error(`Failed to fetch projects: ${projectsRes.statusText}`)
    }

    const projectsData = await projectsRes.json()
    const defaultProject = projectsData.list?.[0]

    if (!defaultProject) {
      throw new Error('No projects found in NocoBase')
    }

    console.log(`✅ Проект найден: ${defaultProject.title}`)

    // Step 2: Check if table already exists
    console.log('🔍 Проверяем, существует ли таблица CompanyInfo...')
    const tablesUrl = `${NOCO_BASE_URL}/api/v1/db/meta/projects/${defaultProject.id}/tables`
    const tablesRes = await fetch(tablesUrl, {
      headers: {
        'xc-auth': NOCO_TOKEN,
      },
    })

    if (!tablesRes.ok) {
      throw new Error(`Failed to fetch tables: ${tablesRes.statusText}`)
    }

    const tablesData = await tablesRes.json()
    const existingTable = tablesData.list?.find((t: any) => t.title === 'CompanyInfo')

    let tableId: string

    if (existingTable) {
      console.log('✅ Таблица CompanyInfo уже существует')
      tableId = existingTable.id
    } else {
      // Step 3: Create table
      console.log('📝 Создаем таблицу CompanyInfo...')
      const createTableRes = await fetch(tablesUrl, {
        method: 'POST',
        headers: {
          'xc-auth': NOCO_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'CompanyInfo',
          columns: [
            {
              column_name: 'id',
              uidt: 'ID',
              pk: true,
            },
            {
              column_name: 'key',
              uidt: 'SingleLineText',
              required: true,
            },
            {
              column_name: 'value',
              uidt: 'LongText',
              required: true,
            },
            {
              column_name: 'category',
              uidt: 'SingleLineText',
              required: true,
            },
            {
              column_name: 'active',
              uidt: 'Checkbox',
              default: true,
            },
          ],
        }),
      })

      if (!createTableRes.ok) {
        const error = await createTableRes.json()
        throw new Error(`Failed to create table: ${error.message || createTableRes.statusText}`)
      }

      const tableData = await createTableRes.json()
      tableId = tableData.id
      console.log('✅ Таблица CompanyInfo создана')
    }

    // Step 4: Add data
    console.log(`📦 Добавляем ${COMPANY_DATA.length} записей...`)

    const dataUrl = `${NOCO_BASE_URL}/api/v1/db/data/noco/CompanyInfo`

    for (const record of COMPANY_DATA) {
      const addRes = await fetch(dataUrl, {
        method: 'POST',
        headers: {
          'xc-auth': NOCO_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      })

      if (!addRes.ok) {
        const error = await addRes.json()
        console.warn(`⚠️ Не удалось добавить запись ${record.key}:`, error.message)
      } else {
        process.stdout.write('.')
      }
    }

    console.log('\n✅ Все данные добавлены!')
    console.log('\n🎉 Таблица CompanyInfo успешно создана и заполнена!')
    console.log(`📊 Всего добавлено ${COMPANY_DATA.length} записей`)
    console.log('\n📝 Следующий шаг: откройте http://138.2.134.17:20000/nc/p1 и посмотрите на таблицу CompanyInfo')
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message)
    process.exit(1)
  }
}

setupCompanyInfo()
