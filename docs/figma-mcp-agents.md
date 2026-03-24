# Figma MCP + Agents — Техническая документация

> Figma открыла canvas для AI-агентов. Агенты теперь могут создавать и редактировать
> нативный Figma-контент напрямую через MCP-протокол. Это радикально меняет
> ветку Figma Build в SiteSynth.

---

## 1. Что изменилось

**Раньше (наш текущий подход):**
```
figmaBuilderAgent → JSON команды → figma-builder.js worker → Plugin API / MCP proxy
```
Мы сами придумывали формат команд (`create_page`, `create_frame`, `set_fill`...),
транслировали их через воркер на Linux, и отправляли через MCP-Front прокси
или Figma Desktop Plugin. Это работало, но было хрупким — наш формат не совпадал
с нативным Figma API, и каждая новая операция требовала ручного маппинга.

**Теперь (официальный Figma MCP):**
```
AI Agent → use_figma tool → mcp.figma.com → нативный Figma canvas
```
Figma выпустила **официальный MCP-сервер** с инструментом `use_figma`,
который позволяет агентам напрямую создавать/редактировать:
- Frames, компоненты, варианты
- Auto Layout
- Переменные (variables) и стили
- Component instances
- Текст, цвета, эффекты

Плюс **Skills** — markdown-файлы, которые учат агентов КАК работать в Figma
с учётом дизайн-системы команды.

---

## 2. Все 16 инструментов Figma MCP Server

### Чтение дизайна

| Инструмент | Что делает | Типы файлов |
|-----------|-----------|-------------|
| `get_design_context` | Извлекает стили и код (React+Tailwind по умолчанию) для выбранных слоёв | Design, Make |
| `get_variable_defs` | Возвращает переменные: цвета, отступы, типографику | Design |
| `get_metadata` | XML-представление: ID, имена, типы, позиции, размеры слоёв | Design |
| `get_screenshot` | Скриншот выбранных элементов | Design, FigJam |
| `get_figjam` | Конвертирует FigJam-диаграммы в XML + скриншоты | FigJam |
| `get_code_connect_map` | Маппинг Figma node → код компонент | Design |
| `get_code_connect_suggestions` | Автоматическое предложение маппингов | Design |
| `search_design_system` | Поиск компонентов/переменных/стилей в подключённых библиотеках | Design |
| `whoami` | Информация о текущем пользователе и плане (Remote only) | — |

### Запись в Figma

| Инструмент | Что делает | Типы файлов |
|-----------|-----------|-------------|
| `use_figma` | **Главный инструмент.** Создание/редактирование/удаление/инспекция Figma-объектов | Design, FigJam |
| `generate_figma_design` | Конвертирует HTML/UI с живого сайта в Figma-слои (Remote only) | Design |
| `create_new_file` | Создаёт пустой файл Figma Design или FigJam | — |
| `add_code_connect_map` | Создаёт маппинг Figma node → код | Design |
| `send_code_connect_mappings` | Подтверждает маппинги после предложений | Design |
| `generate_diagram` | Создаёт FigJam-диаграммы из Mermaid или текста | — |
| `create_design_system_rules` | Генерирует файлы правил для design-to-code | — |

### `use_figma` — ключевой инструмент

Это универсальный инструмент для работы с canvas:
- Создание фреймов, компонентов, вариантов
- Настройка Auto Layout
- Создание/обновление переменных (design tokens)
- Заливки, обводки, эффекты, типографика
- Удаление и инспекция объектов

**Примеры вызовов:**
```
"add a new frame to my file"
"create a color variable collection from design tokens"
"generate variants for the card component"
"fix the layout issues in this frame"
```

**Важно:** `use_figma` бесплатен во время бета. Потом станет usage-based paid feature.

### `generate_figma_design` — HTML→Figma

Конвертирует живой UI (HTML/CSS) с веб-приложений в редактируемые Figma-слои.
Можно отправить в:
- Новый файл
- Существующий файл
- Буфер обмена

**Сценарий для SiteSynth:** После того как Cline собрал demo-сайт,
можно конвертировать HTML обратно в Figma для ревью и итераций.

---

## 3. Skills — инструкции для агентов

**Skills** — это markdown-файлы, которые объясняют агенту КАК работать в Figma.
Они не требуют кода или плагинов — просто текстовые инструкции.

### Встроенные skills:
- `/figma-use` — базовый skill, на котором строятся все остальные
- `/figma-generate-library` — создаёт компоненты из кодовой базы
- `/figma-generate-design` — создаёт дизайны из существующих компонентов и переменных

### Community skills (примеры):
- `/create-voice` — генерирует спецификации screen reader (VoiceOver, TalkBack, ARIA)
- `/cc-figma-component` — создаёт компоненты из JSON-контракта
- `/apply-design-system` — подключает существующие дизайны к компонентам системы
- `/rad-spacing` — применяет иерархические отступы через переменные
- `/edit-figma-design` — оркестрирует Figma-воркфлоу через Warp
- `/sync-figma-token` — синхронизация design tokens между кодом и Figma variables
- `/multi-agent` — параллельные воркфлоу для реализации дизайнов

### Self-healing loop

Skills поддерживают итеративный цикл:
```
Agent создаёт экран
  → get_screenshot (скриншот результата)
  → Agent оценивает что не совпадает
  → use_figma (исправляет)
  → повторяет до совпадения
```

Это работает потому что агент работает с настоящей структурой —
компоненты, переменные, Auto Layout — а не просто с визуальным выводом.

---

## 4. Подключение и настройка

### Remote Server (рекомендуется)

**URL:** `https://mcp.figma.com/mcp`

**Claude Code:**
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
# или глобально:
claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user
```

Или через плагин:
```bash
claude plugin install figma@claude-plugins-official
```

**Cursor:**
```
/add-plugin figma
```

**VS Code (mcp.json):**
```json
{
  "servers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    }
  }
}
```

**Codex:**
```bash
codex mcp add figma --url https://mcp.figma.com/mcp
```

### Аутентификация

OAuth-флоу через браузер. Не нужны API-ключи — авторизация через Figma аккаунт.

### Rate Limits

| Тип сиденья | Лимит |
|-------------|-------|
| Starter/View | 6 tool calls / месяц |
| Dev/Full (платные планы) | REST API rate limits Tier 1 |
| Write operations (бета) | Без лимитов |

---

## 5. Что это меняет для SiteSynth

### Текущая архитектура (Ветка Figma Build)

```
Brief → Design Spec → architectAgent → figmaBuilderAgent
  → JSON commands [create_page, create_frame, set_fill...]
  → figma-builder.js worker (Linux)
  → MCP-Front proxy (порт 8888)
  → mcp.figma.com (OAuth)
  → Figma File
```

**Проблемы текущего подхода:**
1. Наш формат команд — самодельный, не совпадает с Figma API
2. Нужен MCP-Front прокси на Linux
3. Нужен воркер-поллер
4. Нет self-healing loop
5. Нет доступа к дизайн-системе клиента
6. criticAgent оценивает, но не может исправить

### Целевая архитектура (с use_figma)

```
Brief → Design Spec → Art Direction Contract
  → artDirectorAgent → art_direction_contract.json
  → Agent (Claude Code / Cline) с Figma MCP
    → search_design_system (ищет компоненты в библиотеке клиента)
    → create_new_file (создаёт файл)
    → use_figma (строит дизайн из компонентов и переменных)
    → get_screenshot (скриншот результата)
    → criticAgent (оценка)
    → use_figma (исправления)
    → цикл до оценки ≥ 4/5
  → Figma File URL
```

**Преимущества:**
1. Нативный Figma API — не нужен самодельный формат команд
2. Не нужен MCP-Front прокси — прямое подключение к `mcp.figma.com`
3. Не нужен figma-builder.js worker — агент работает напрямую
4. Self-healing loop через `get_screenshot` + `use_figma`
5. Доступ к дизайн-системе клиента через `search_design_system`
6. Skills задают правила работы — не нужно описывать каждую операцию

### Что можно убрать

| Компонент | Статус |
|-----------|--------|
| `figma-builder.js` worker | Заменяется на прямой `use_figma` |
| MCP-Front proxy | Не нужен для Figma (остаётся для других MCP серверов) |
| Самодельный формат команд в `figmaBuilderAgent` | Заменяется на `use_figma` |
| `figma-builder.service` на Linux | Можно остановить |

### Что остаётся

| Компонент | Зачем |
|-----------|-------|
| `artDirectorAgent` | Создаёт art direction contract |
| `criticAgent` | Оценивает скриншот результата |
| Design Spec generation | Входные данные для art direction |
| Reference Research pipeline | Визуальное направление |

---

## 6. Создание custom Skill для SiteSynth

Skill — это markdown-файл в папке `skills/` или `instructions/`.

Пример skill для SiteSynth (`/sitesynth-build-design`):

```markdown
# SiteSynth Design Build Skill

## Context
You are building a Figma design from an art direction contract.
The contract contains exact colors, typography, spacing, section blueprints,
and component recipes.

## Steps

1. **Read the art direction contract** from the provided JSON
2. **Create a new Figma file** using `create_new_file`
3. **Set up variables** — create color, spacing, and typography variable collections
   using values from the contract's `color_system`, `spacing`, and `typography`
4. **Search design system** for existing components that match `component_recipes`
5. **Build page structure** — create frames for each section in `section_blueprints`
6. **Apply Auto Layout** to all sections for responsive behavior
7. **Use components** from the design system where available
8. **Take screenshot** and verify against the art direction contract
9. **Fix any issues** — iterate until the design matches the contract

## Rules
- Always use variables, never hardcode colors
- Use Auto Layout on every frame
- Name layers semantically: "Hero/Headline", "Features/Card/Title"
- Follow the exact typography scale from the contract
- Respect anti_patterns — never use patterns listed there
```

---

## 7. Два дополняющих инструмента

### `generate_figma_design` — Код → Canvas

**Сценарий:** После того как Cline собрал demo-сайт на `demo.sitesynth.com/slug/`,
можно конвертировать этот HTML обратно в Figma:

```
Agent: "generate_figma_design from https://demo.sitesynth.com/my-project/"
→ Figma создаёт редактируемые слои из живого HTML
→ Дизайнер может итерировать в Figma
→ Изменения идут обратно в код через get_design_context
```

### `use_figma` — Canvas → Дизайн

**Сценарий:** Создание дизайна с нуля из art direction contract:

```
Agent: "use art direction contract to build homepage in Figma"
→ Agent вызывает search_design_system для существующих компонентов
→ Agent вызывает use_figma для создания фреймов и наполнения
→ Agent вызывает get_screenshot для проверки
→ Итерация до готовности
```

---

## 8. Roundtrip: Code ↔ Canvas

Полный цикл теперь возможен:

```
Brief
  → Art Direction Contract
  → Cline Build (HTML/CSS → demo.sitesynth.com)
  → generate_figma_design (HTML → Figma слои)
  → Дизайнер итерирует в Figma
  → get_design_context (Figma → код)
  → Cline обновляет demo-сайт
  → Публикация
```

Или в другом направлении:

```
Brief
  → Art Direction Contract
  → use_figma (создание дизайна в Figma)
  → get_screenshot + criticAgent (ревью)
  → use_figma (исправления)
  → get_design_context (экспорт кода)
  → Cline доводит до production
  → Публикация на demo.sitesynth.com
```

---

## 9. Практический план миграции

### Фаза 1: Подключение (сейчас)
1. `claude mcp add figma https://mcp.figma.com/mcp` на Oracle сервере
2. Авторизация через Figma аккаунт
3. Тест: `use_figma` → создать тестовый фрейм

### Фаза 2: Skill (неделя)
1. Написать SiteSynth Figma Skill (markdown)
2. Тест: Brief → Art Direction → Figma Design через skill

### Фаза 3: Интеграция (2 недели)
1. Обновить `demo/build.ts` — добавить шаг `generate_figma_design` после publish
2. Добавить critic loop: `get_screenshot` → `criticAgent` → `use_figma`
3. Убрать figma-builder.js worker

### Фаза 4: Deprecation
1. Остановить `figma-builder.service`
2. Убрать MCP-Front Figma маршрут (оставить для других сервисов)
3. Удалить самодельный формат команд из `figmaBuilderAgent`

---

*Обновлено: Март 2026*

Sources:
- [Figma MCP Server — Developer Docs](https://developers.figma.com/docs/figma-mcp-server/)
- [Tools and Prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Code to Canvas](https://developers.figma.com/docs/figma-mcp-server/code-to-canvas/)
- [Remote Server Setup](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
- [Figma MCP Server Guide (GitHub)](https://github.com/figma/mcp-server-guide)
- [Agents, Meet the Figma Canvas (Blog)](https://www.figma.com/blog/the-figma-canvas-is-now-open-to-agents/)
- [Guide to the Figma MCP Server (Help Center)](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
