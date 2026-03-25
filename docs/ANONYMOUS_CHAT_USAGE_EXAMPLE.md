# Пример использования анонимного чата

## Frontend: cabinet.vue (или любая страница с чатом)

### 1. Импортировать composable

```vue
<script setup lang="ts">
import { useAnonymousChat } from '~/composables/useAnonymousChat'

const {
  deviceId,
  conversationId,
  setConversationId,
  setClaimToken,
  hasActiveConversation,
} = useAnonymousChat()
</script>
```

### 2. Открытие чат drawer

```typescript
// Функция при клике на "Open Chat"
const openChatDrawer = async () => {
  // Если уже есть активная conversation — загрузим её
  if (hasActiveConversation()) {
    drawer.value.isOpen = true
    drawer.value.conversationId = conversationId
    await loadMessages(conversationId, deviceId)
    return
  }

  // Создаём новую анонимную conversation
  try {
    const response = await fetch('/api/chat/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': deviceId, // ← Передаём device_id для анонимного чата
      },
      body: JSON.stringify({
        agent_type: 'presale', // или 'briefing'
        title: `Chat - ${new Date().toLocaleString()}`,
      }),
    })

    const { data } = await response.json()

    // Сохраняем conversation ID в localStorage
    setConversationId(data.id)

    // Сохраняем claim_token для регистрации (будет нужен позже)
    setClaimToken(data.claim_token)

    drawer.value.isOpen = true
    drawer.value.conversationId = data.id
    messages.value = []
  } catch (error) {
    console.error('Failed to create conversation:', error)
  }
}
```

### 3. Отправка сообщения

```typescript
const sendMessage = async (text: string) => {
  if (!conversationId) {
    console.error('No active conversation')
    return
  }

  try {
    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': deviceId, // ← device_id для анонимного
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        message: text,
        agent_type: 'presale',
      }),
    })

    const { data } = await response.json()

    // Добавляем сообщение в UI
    messages.value.push({
      id: data.id,
      role: 'user',
      content: text,
    })

    // Если есть response от agent
    if (data.response) {
      messages.value.push({
        role: 'assistant',
        content: data.response,
      })
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}
```

### 4. Загрузка истории сообщений

```typescript
const loadMessages = async (convId: string, deviceId: string) => {
  try {
    const response = await fetch(`/api/chat/messages?conversation_id=${convId}`, {
      headers: {
        'x-device-id': deviceId, // ← device_id для проверки ownership
      },
    })

    const { messages: loaded } = await response.json()
    messages.value = loaded
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}
```

---

## При регистрации (register.vue или intake-form.vue)

### 1. After payment → Register

```typescript
const submitIntakeAndRegister = async (formData: IntakeForm) => {
  // 1. Process payment
  const payment = await processPayment(formData)
  if (!payment.success) return

  // 2. Get claim_token from anonymous chat
  const { getClaimToken } = useAnonymousChat()
  const claimToken = getClaimToken()

  // 3. Register user
  try {
    const registerResponse = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        claim_token: claimToken, // ← Link anonymous chat to new account
      }),
    })

    const { success, user } = await registerResponse.json()
    if (!success) throw new Error('Registration failed')

    // 4. Server calls /api/auth/claim-conversation internally
    // (conversation is now tied to user_email)

    // 5. Clear anonymous chat data
    const { reset } = useAnonymousChat()
    reset()

    // 6. Login
    await loginUser(formData.email, formData.password)

    // 7. Redirect to cabinet
    navigateTo('/cabinet')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
```

### 2. Backend register endpoint (server/api/auth/register.ts)

```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, claim_token } = body

  try {
    const db = useDatabaseClient()

    // 1. Create user
    const { data: user, error: createError } = await db
      .auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (createError) throw new Error(`Failed to create user: ${createError.message}`)

    // 2. Claim conversation if provided
    if (claim_token) {
      const { error: claimError } = await db
        .from('conversations')
        .update({
          user_email: email,
          claimed_at: new Date().toISOString(),
          claim_token: null,
        })
        .eq('claim_token', claim_token)

      if (claimError) {
        console.error('Failed to claim conversation:', claimError)
        // Don't fail registration, just log warning
      } else {
        console.log(`Claimed conversation for user ${email}`)
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    }
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }
})
```

---

## Проверка владельца (backend)

### Для анонимного пользователя

```typescript
// Frontend отправляет:
const response = await fetch('/api/chat/messages', {
  method: 'POST',
  headers: {
    'x-device-id': '550e8400-e29b-41d4-a716-446655440000', // ← UUID браузера
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    conversation_id: conversationId,
    message: 'Hello',
    agent_type: 'presale',
  }),
})

// Backend проверяет:
const deviceId = getHeader(event, 'x-device-id') // '550e8400-e29b-41d4-a716-446655440000'

const { data: conversation } = await db
  .from('conversations')
  .select('device_id, user_email')
  .eq('id', conversationId)
  .single()

// conversation = { device_id: '550e8400-e29b-41d4-a716-446655440000', user_email: null }

const isOwner = conversation.device_id === deviceId // ✅ true → allow
```

### Для аутентифицированного пользователя

```typescript
// Frontend отправляет:
const response = await fetch('/api/chat/messages', {
  method: 'POST',
  headers: {
    'x-user-email': 'john@example.com', // ← После логина
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    conversation_id: conversationId,
    message: 'Hello',
    agent_type: 'briefing',
  }),
})

// Backend проверяет:
const userEmail = getHeader(event, 'x-user-email') // 'john@example.com'

const { data: conversation } = await db
  .from('conversations')
  .select('device_id, user_email')
  .eq('id', conversationId)
  .single()

// conversation = { device_id: null, user_email: 'john@example.com' }

const isOwner = conversation.user_email === userEmail // ✅ true → allow
```

---

## Кроссбраузерный доступ после регистрации

```
Сценарий:

1. Пользователь открывает Chrome
   ↓
   device_id_A = "550e8400-e29b-41d4-a716-446655440000"
   ↓
   Пишет сообщения в чат (анонимно)
   ↓
   Регистрируется с email "john@example.com"
   ↓
   conversation.claimed_at = NOW(), conversation.user_email = "john@example.com"
   ↓

2. Пользователь открывает Firefox
   ↓
   device_id_B = "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6" (другой браузер!)
   ↓
   Но у него есть токен auth (cookies)
   ↓
   Логинится в кабинет
   ↓
   x-user-email = "john@example.com"
   ↓
   Видит ТУ ЖЕ переписку (device_id не нужен)
   ↓
   conversation.user_email = "john@example.com" → можно читать!
```

---

## Безопасность: Проверка RLS (базовая)

После миграции `20260326_anonymous_chat_support.sql` в БД будут RLS политики.
Но на API уровне ТАКЖЕ проверяем (defense in depth):

```typescript
// Даже если RLS не сработает, API ещё раз проверит:
const userEmail = getHeader(event, 'x-user-email')
const deviceId = getHeader(event, 'x-device-id')

const { data: conversation } = await db
  .from('conversations')
  .select('device_id, user_email')
  .eq('id', conversationId)
  .single()

if (
  !(conversation.device_id === deviceId) &&
  !(conversation.user_email === userEmail)
) {
  return createError({ statusCode: 403, statusMessage: 'Access denied' })
}
```

Двойная проверка (RLS + API) = максимальная безопасность.
