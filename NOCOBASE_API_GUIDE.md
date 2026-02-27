# NocoBase API Guide

Этот сервер NocoBase использует **нестандартный API формат** — не REST v1/v2, а собственный синтаксис с двоеточием.

## Аутентификация

```http
Authorization: Bearer YOUR_TOKEN
```

**Важно:** `xc-auth` и `xc-token` — НЕ работают на этом сервере. Только `Authorization: Bearer`.

Токен берётся из `.env.local`:
```
NOCO_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## Формат URL

```
http://138.2.134.17:20000/api/{TableName}:{action}
```

---

## CRUD Операции

### Создать таблицу
```http
POST /api/collections:create
Content-Type: application/json

{
  "name": "MyTable",
  "title": "MyTable",
  "fields": [
    { "name": "fieldName", "title": "fieldName", "type": "string" },
    { "name": "content",   "title": "content",   "type": "text" },
    { "name": "count",     "title": "count",     "type": "number" },
    { "name": "active",    "title": "active",    "type": "boolean" }
  ]
}
```

Типы полей: `string`, `text`, `number`, `boolean`, `date`
**Не поддерживается:** `reference` (связи настраиваются в UI)

---

### Получить список записей
```http
POST /api/MyTable:list
Content-Type: application/json

{}
```

**Параметры в теле запроса:**
```json
{
  "pageSize": 100,
  "filter": { "fieldName": "value" },
  "sort": "fieldName"      // по возрастанию
}
```

Или с минус для убывания в sort: `"-fieldName"`

**Ответ:**
```json
{
  "data": [ { "id": 1, "fieldName": "..." }, ... ],
  "meta": { 
    "count": 24, 
    "page": 1,
    "pageSize": 20,
    "totalPage": 2
  }
}
```

⚠️ **Важно:** Используется **POST**, не GET! Пустой объект `{}` в теле для получения всех записей.

---

### Создать запись
```http
POST /api/MyTable:create
Content-Type: application/json

{
  "fieldName": "value",
  "active": true
}
```

**Ответ:**
```json
{
  "data": { "id": 5, "fieldName": "value", ... }
}
```

---

### Обновить запись
```http
PUT /api/MyTable:update?filter[id]=5
Content-Type: application/json

{ "fieldName": "new value" }
```

---

### Удалить записи
```http
DELETE /api/MyTable:destroy?filter[id]=5
DELETE /api/MyTable:destroy?filter[userEmail]=user@example.com
```

**Ответ:**
```json
{ "data": 1 }   // количество удалённых записей
```

---

## Фильтрация

```
?filter[field]=value                  # точное совпадение
?filter[field][$like]=%searchterm%   # поиск по подстроке
```

Несколько фильтров:
```
?filter[category]=services&filter[active]=true
```

---

## Пример TypeScript (Nuxt server)

```typescript
const BASE = process.env.NOCO_BASE_URL
const TOKEN = process.env.NOCO_TOKEN
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
}

// Получить список (используется POST!)
const res = await fetch(`${BASE}/api/CompanyInfo:list`, {
  method: 'POST',
  headers,
  body: JSON.stringify({})  // пустой объект для получения всех записей
})
const { data } = await res.json()  // data — массив записей

// С фильтром
const res2 = await fetch(`${BASE}/api/orders:list`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    filter: { "email": "user@example.com" },
    pageSize: 50
  })
})

// POST (создание)
await fetch(`${BASE}/api/ChatHistory:create`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ userEmail, role: 'user', content: 'Hello' })
})

// DELETE
await fetch(`${BASE}/api/ChatHistory:destroy?filter[userEmail]=${encodeURIComponent(email)}`, {
  method: 'DELETE',
  headers
})
```

---

## Интеграция AI (Gemini)

В `server/api/ai-chat.ts` AI получает контекст о компании из NocoBase:

```typescript
// Загружаем данные компании
const companyRes = await fetch('/api/company-info')
const { data } = await companyRes.json()

// Формируем системный промпт
const companyContext = data.map(r => `${r.key}: ${r.value}`).join('\n')
const systemPrompt = `Ты AI ассистент компании SiteSynth.\n\n${companyContext}`

// Отправляем в Gemini
const response = await fetch('https://generativelanguage.googleapis.com/...', {
  body: JSON.stringify({
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: messages,
    generationConfig: { maxOutputTokens: 2000 }
  })
})
```

**LLM Provider:** `gemini-2.5-pro` (через env `LLM_PROVIDER=google`, `LLM_API_KEY=...`)

---

## Таблицы в проекте

| Таблица | Назначение | Ключевые поля |
|---------|-----------|---------------|
| `orders` | Заказы клиентов | id, email, client_id, title, status, amount, currency, stripe_charge_id, payment_date, form_data |
| `projects` | Проекты клиентов | id, email, title, description, status |
| `clients` | Информация о клиентах | id, email, name, phone, country |
| `ChatHistory` | История чата | userEmail, role, content, timestamp |
| `ChatContext` | Контекст сессии | userEmail, contextData |
| `CompanyInfo` | Данные о компании | key, value, category, active |

### Структура таблицы `orders`
```json
{
  "id": 1,
  "email": "user@example.com",
  "client_id": 1,
  "title": "Web Design Project",
  "status": "completed",
  "amount": 5000,
  "currency": "USD",
  "stripe_charge_id": "ch_1A2B3C4D5E6F7G8H9I0J",
  "payment_date": "2024-01-15T10:30:00Z",
  "form_data": {
    "intakeFormData": {
      "brief": "...",
      "timeline": "...",
      "budget": "...",
      "features": ["..."]
    },
    "billingData": {
      "firstName": "...",
      "lastName": "...",
      "email": "user@example.com",
      "country": "US"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Что НЕ работает

- ❌ `/api/v1/db/meta/projects` — 404
- ❌ `/api/v2/tables` — 404
- ❌ `GET /api/{table}:list` — должен быть POST
- ❌ `xc-auth` заголовок — используйте `Authorization: Bearer`
- ❌ `xc-token` заголовок — используйте `Authorization: Bearer`

---

## Известные Проблемы и Решения

### Проблема: "404 на /api/orders:list"
**Решение:** Используйте **POST** вместо GET:
```bash
curl -X POST 'http://138.2.134.17:20000/api/orders:list' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### Проблема: "401 или EMPTY_TOKEN ошибка"
**Решение:** 
1. Проверьте что используется **`Authorization: Bearer`**, не `xc-auth`
2. Убедитесь что токен в `.env.local` корректен и не истёк
3. Если токен истёк, получите новый в NocoBase UI

### Проблема: "Таблица не найдена"
**Решение:** Таблица должна быть создана в UI или через API. Если создали через API, перезагрузите NocoBase контейнер:
```bash
docker restart nocobase_app_1
```

---

## История Обновлений

**2024-01-15:** 
- ✅ Обновлена документация для POST методов
- ✅ Добавлены примеры с правильной авторизацией
- ✅ Документированы структуры таблиц `orders` и `projects`
- ✅ Добавлены решения для распространённых проблем
