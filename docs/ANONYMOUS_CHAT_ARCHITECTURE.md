# Анонимный чат с переходом на авторизацию

## Проблема

Сейчас `user_email NOT NULL` в conversations — невозможно создать анонимный чат.

Нужна архитектура:
1. **Anon phase**: Пользователь открывает сайт → браузер генерит device_id → создаётся conversation
2. **Auth phase**: После регистрации conversation claim-ится под user_email
3. **Privacy**: История видна только в этом браузере (localStorage) пока не авторизован

---

## Новая schema

### Миграция: `20260326_anonymous_chat_support.sql`

```sql
-- Add device_id and claim_token to conversations
ALTER TABLE conversations
  ADD COLUMN device_id UUID,
  ADD COLUMN claim_token VARCHAR(256) UNIQUE,
  ADD COLUMN claimed_at TIMESTAMP,
  ALTER COLUMN user_email DROP NOT NULL;

-- Update constraints
ALTER TABLE conversations
  ADD CONSTRAINT check_device_or_email CHECK (device_id IS NOT NULL OR user_email IS NOT NULL);

-- Create indexes for fast lookups
CREATE INDEX idx_conversations_device_id ON conversations(device_id);
CREATE INDEX idx_conversations_claim_token ON conversations(claim_token);
CREATE INDEX idx_conversations_claim_status ON conversations(claimed_at);

-- Update comments
COMMENT ON COLUMN conversations.device_id IS 'Browser device identifier for anonymous sessions. Persists in localStorage.';
COMMENT ON COLUMN conversations.user_email IS 'User email after authentication. NULL while anonymous.';
COMMENT ON COLUMN conversations.claim_token IS 'Token for linking anonymous conversation to authenticated user after registration.';
COMMENT ON COLUMN conversations.claimed_at IS 'Timestamp when anonymous session was claimed by user.';

-- Add RLS policies for anonymous access
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anonymous access via device_id
CREATE POLICY "anonymous_access_via_device"
ON conversations
FOR SELECT
USING (
  device_id IS NOT NULL
  AND device_id = current_setting('app.device_id')::uuid
);

-- Policy 2: Authenticated access via user_email
CREATE POLICY "authenticated_access_via_email"
ON conversations
FOR SELECT
USING (
  user_email IS NOT NULL
  AND user_email = auth.email()
);

-- Policy 3: Create as anonymous
CREATE POLICY "create_anonymous_conversation"
ON conversations
FOR INSERT
WITH CHECK (device_id IS NOT NULL);

-- Policy 4: Create as authenticated
CREATE POLICY "create_authenticated_conversation"
ON conversations
FOR INSERT
WITH CHECK (user_email = auth.email());

-- Policy 5: Claim token access
CREATE POLICY "claim_conversation_via_token"
ON conversations
FOR UPDATE
USING (claim_token IS NOT NULL)
WITH CHECK (user_email = auth.email() AND claimed_at IS NULL);

-- Messages: Access if you own the conversation
CREATE POLICY "messages_access_own_conversation"
ON messages
FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE
      (device_id = current_setting('app.device_id')::uuid)
      OR (user_email = auth.email())
  )
);

CREATE POLICY "messages_insert_own_conversation"
ON messages
FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations WHERE
      (device_id = current_setting('app.device_id')::uuid)
      OR (user_email = auth.email())
  )
);
```

---

## Frontend flow

### 1. Инициализация браузера (composables/useAnonymousChat.ts)

```typescript
// Создавать ОДИН раз при первом открытии
export const useAnonymousChat = () => {
  const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('device_id')

    if (!deviceId) {
      // Первый раз — генерируем уникальный ID браузера
      deviceId = crypto.randomUUID()
      localStorage.setItem('device_id', deviceId)
    }

    return deviceId
  }

  const getConversationId = () => {
    return localStorage.getItem('current_conversation_id')
  }

  const setConversationId = (id: string) => {
    localStorage.setItem('current_conversation_id', id)
  }

  return {
    deviceId: getOrCreateDeviceId(),
    conversationId: getConversationId(),
    setConversationId,
  }
}
```

### 2. Открытие чат drawer

```typescript
// pages/cabinet.vue или любая страница с чатом

const openChatDrawer = async () => {
  const { deviceId, conversationId, setConversationId } = useAnonymousChat()

  // Если уже есть активная conversation — используем её
  if (conversationId) {
    drawer.conversationId = conversationId
    loadMessages(conversationId, deviceId)
    return
  }

  // Создаём новую anon conversation
  const response = await fetch('/api/chat/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      device_id: deviceId,
      agent_type: 'briefing',  // или 'presale'
      title: `Chat - ${new Date().toLocaleString()}`
    })
  })

  const { id: newConversationId } = await response.json()

  // Сохраняем conversation ID в localStorage
  setConversationId(newConversationId)
  drawer.conversationId = newConversationId

  // Загружаем пустой чат (впервые)
  messages.value = []
}
```

### 3. Отправка сообщения

```typescript
const sendMessage = async (text: string) => {
  const { deviceId, conversationId } = useAnonymousChat()

  const response = await fetch('/api/chat/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': deviceId  // ← Передаём device_id
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      message: text,
      agent_type: 'briefing'
    })
  })

  const { id: messageId, response: aiResponse } = await response.json()

  // Добавляем в UI
  messages.value.push(
    { id: messageId, role: 'user', content: text },
    { id: messageId + '-ai', role: 'assistant', content: aiResponse }
  )
}
```

---

## Backend API

### Эндпоинт 1: Создание conversation (anon или auth)

**Файл**: `server/api/chat/conversations.ts`

```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { device_id, agent_type, title } = body

  const userEmail = getHeader(event, 'x-user-email') || null
  const db = useDatabaseClient()

  // ✅ Может быть device_id ИЛИ user_email (но не оба!)
  if (!device_id && !userEmail) {
    return { error: 'Either device_id or user_email required' }
  }

  // Генерируем claim token для будущей авторизации
  const claimToken = generateSecureToken()

  const { data: conversation, error } = await db
    .from('conversations')
    .insert({
      device_id: device_id || null,
      user_email: userEmail || null,
      agent_type,
      title: title || `Chat - ${new Date().toISOString()}`,
      claim_token: claimToken,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create conversation:', error)
    return { error: 'Failed to create conversation' }
  }

  return {
    success: true,
    data: {
      id: conversation.id,
      claim_token: claimToken,  // ← Отправляем клиенту для регистрации
    },
  }
})

// Генерируем криптографически безопасный токен
function generateSecureToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
```

### Эндпоинт 2: Загрузка сообщений (device или email)

**Файл**: `server/api/chat/messages.ts`

```typescript
export default defineEventHandler(async (event) => {
  const conversationId = getRouterParam(event, 'conversationId')
  const deviceId = getHeader(event, 'x-device-id') || null
  const userEmail = getHeader(event, 'x-user-email') || null

  const db = useDatabaseClient()

  // ✅ Проверяем владельца conversation (device OR email)
  const { data: conversation, error: convError } = await db
    .from('conversations')
    .select('id, device_id, user_email')
    .eq('id', conversationId)
    .maybeSingle()

  if (!conversation) {
    return { error: 'Conversation not found' }
  }

  // Только владелец может видеть (device_id ИЛИ user_email)
  const isOwner =
    (conversation.device_id && conversation.device_id === deviceId) ||
    (conversation.user_email && conversation.user_email === userEmail)

  if (!isOwner) {
    return { error: 'Access denied' }
  }

  // ✅ Теперь безопасно выдаём сообщения
  const { data: messages } = await db
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  return {
    success: true,
    data: messages,
  }
})
```

### Эндпоинт 3: Claim conversation при регистрации

**Файл**: `server/api/auth/claim-conversation.ts` (НОВЫЙ)

```typescript
/**
 * POST /api/auth/claim-conversation
 *
 * Когда пользователь регистрируется, он получает claim_token.
 * Этот эндпоинт связывает анонимную conversation с его user_email.
 *
 * Результат:
 * - Анонимная история чатов становится его официальной историей
 * - device_id заменяется на user_email (или оба остаются для cross-device доступа)
 * - claim_token инвалидируется
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { claim_token, user_email } = body

  if (!claim_token || !user_email) {
    return { error: 'claim_token and user_email required' }
  }

  const db = useDatabaseClient()

  // ✅ Найти conversation по claim_token
  const { data: conversation, error: findError } = await db
    .from('conversations')
    .select('id, device_id, user_email, claimed_at')
    .eq('claim_token', claim_token)
    .maybeSingle()

  if (!conversation) {
    return { error: 'Invalid or expired claim token' }
  }

  if (conversation.claimed_at) {
    return { error: 'This conversation has already been claimed' }
  }

  // ✅ Обновляем conversation: добавляем user_email и отмечаем как claimed
  const { error: updateError } = await db
    .from('conversations')
    .update({
      user_email,
      claimed_at: new Date().toISOString(),
      claim_token: null,  // инвалидируем токен
    })
    .eq('id', conversation.id)

  if (updateError) {
    console.error('Failed to claim conversation:', updateError)
    return { error: 'Failed to claim conversation' }
  }

  return {
    success: true,
    message: 'Conversation claimed successfully',
    conversationId: conversation.id,
  }
})
```

---

## Регистрация flow (presale → intake form → register)

### 1. Presale agent в чате → предлагает регистрацию

```typescript
// Когда presale agent отправляет пользователю CTA к регистрации:
// "Готов начать? Нажми 'Создать профиль' →"

// CTA клик → открывает intake form / registration
```

### 2. После оплаты в intake form

```typescript
// intake-form.vue

const submitIntakeAndRegister = async (formData) => {
  // 1. Оплачиваем
  const payment = await processPayment(formData)

  if (!payment.success) return

  // 2. Получаем claim_token из conversation
  const { deviceId } = useAnonymousChat()
  const claimToken = localStorage.getItem('claim_token')  // ← Сохранили после создания conversation

  // 3. Регистрируем пользователя
  const register = await fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
      claim_token: claimToken,  // ← Связываем с анонимным чатом
    })
  })

  // 4. Сервер claim-ит conversation
  // (происходит в /api/auth/register, перед созданием user)

  // 5. Login
  await loginUser(formData.email, formData.password)

  // 6. История чата теперь привязана к user_email
  // Пользователь может логиниться с других браузеров — история будет видна
}
```

---

## Итоговый flow

```
ШАГИ:

1. Пользователь открывает сайт (любой браузер)
   ↓
   device_id генерируется → localStorage
   ↓

2. Кликает на "Open Chat"
   ↓
   создаётся conversation(device_id=xxx, user_email=null, claim_token=yyy)
   ↓
   claim_token сохраняется в localStorage
   ↓

3. Пишет сообщения в чат
   ↓
   сообщения привязаны к conversation_id
   ↓
   доступ проверяется через device_id (localStorage)
   ↓

4. Нажимает "Register" → Fills intake form → Платит
   ↓
   POST /auth/claim-conversation с claim_token
   ↓
   conversation.user_email = email@example.com
   ↓
   conversation.claimed_at = NOW()
   ↓

5. Логинится в кабинет
   ↓
   сообщения загружаются через user_email доступ
   ↓
   может логиниться с других браузеров — история видна
   ↓
   device_id перестаёт быть нужен (но хранится для audit trail)
```

---

## Безопасность

| Сценарий | Что происходит |
|----------|---|
| Пользователь A открывает Chrome | Генерируется device_id_A, сохраняется в localStorage Chrome |
| Пользователь B открывает Chrome на том же компьютере | Генерируется device_id_B (разные localStorage!) |
| Пользователь A открывает Safari | Генерируется device_id_A' (разные браузеры = разные device_ids) |
| Пользователь A знает conversation_id B | Если не знает device_id B или email B — не может прочитать |
| Пользователь A регистрируется | conversation claim-ится под его email, может логиниться везде |
| Сервер проверяет доступ | device_id из headers vs conversation.device_id (RLS) |

---

## Что нужно изменить

| Файл | Что | Статус |
|------|-----|--------|
| `migrations/20260326_anonymous_chat_support.sql` | Новая миграция | ✅ Выше |
| `server/api/chat/conversations.ts` | Поддержка device_id | 🔴 Нужна |
| `server/api/chat/messages.ts` | Проверка device_id owner | 🔴 Нужна |
| `server/api/auth/claim-conversation.ts` | Новый эндпоинт | 🔴 Нужен |
| `composables/useAnonymousChat.ts` | Новая composable | 🔴 Нужна |
| `pages/cabinet.vue` | Передавать device_id в headers | 🔴 Нужна |

**Всего изменений: ~30 мин работы**
