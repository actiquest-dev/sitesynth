# Deployment на Vercel с VoltOps

SiteSynth уже настроен для Vercel! Вот как это работает на production.

## ✅ Vercel Setup (автоматический)

Проект использует:
- `nitro.preset: "vercel"` в `nuxt.config.js`
- Serverless Functions для API endpoints
- SSR для всех страниц

## 🔐 Environment Variables на Vercel

1. Откройте Vercel Dashboard → Project Settings → Environment Variables
2. Добавьте переменные:

```bash
# Database
SUPABASE_URL=https://wkxwjasgyulakiyclipb.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Drive
GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL=your_email@...iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY=your_private_key

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id

# LLM (Google Gemini)
LLM_PROVIDER=google
LLM_API_KEY=your_gemini_api_key

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# VoltOps Integration (ВАЖНО!)
VOLTAGENT_API_KEY=your_voltagent_api_key
VOLTAGENT_PROJECT_ID=sitesynth
LOG_LEVEL=info
```

## 🚀 Развертывание

### Вариант 1: GitHub Integration (рекомендуется)

1. Подключите GitHub репозиторий к Vercel
2. Каждый push к `main` автоматически развернет
3. Просмотрите Deployment в Vercel Dashboard

```bash
git push origin main  # Автоматически развернет на Vercel
```

### Вариант 2: Vercel CLI

```bash
# Установить Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## ⚡ Optimization для Vercel

VoltOps логирование **оптимизировано** для serverless:

### 🔥 Non-Blocking Logs
```typescript
// Логи отправляются асинхронно (fire-and-forget)
// Не блокируют HTTP ответ пользователю
sendLogToVoltOps(logData)  // async, no await
```

### ✅ Безопасно для Vercel
- Timeout не сработает (логи отправляются в фоне)
- Ответ пользователю отправляется сразу
- Логи все равно попадают в VoltOps
- Если VoltOps недоступна - обработается gracefully

## 📊 Мониторинг на Production

1. Откройте VoltOps Console: https://console.voltagent.dev
2. Выберите проект "sitesynth"
3. Смотрите:
   - **Live Logs** - что происходит прямо сейчас на production
   - **Errors** - ошибки агентов в production
   - **Performance** - время ответа от Gemini API
   - **Traces** - полная история каждого запроса

## 🔍 Debugging на Production

**Проблема: Логи не появляются в VoltOps**

1. Проверьте Environment Variables в Vercel:
   ```bash
   vercel env list
   ```

2. Проверьте логи в Vercel:
   ```bash
   vercel logs --tail
   ```

3. Проверьте что VOLTAGENT_API_KEY корректный:
   - Откройте https://console.voltagent.dev
   - Скопируйте свой API key
   - Обновите в Vercel → redeploy

## 📈 Performance on Vercel

### Холодные Старты (Cold Starts)
- Первый запрос: ~3-5 сек (холодный старт функции)
- Следующие запросы: ~100-500мс (теплая функция)
- Vercel автоматически оптимизирует по использованию

### Оптимизация
```bash
# vercel.json можно расширить для production

{
  "buildCommand": "npm run build",
  "outputDirectory": ".output",
  "headers": [...],
  "functions": {
    "server/api/ai-chat.ts": {
      "maxDuration": 60  # 60 сек для Pro план
    }
  }
}
```

## 🎯 Как работает на Production

```
User in Cabinet
      ↓
POST /api/ai-chat (HTTPS)
      ↓
Vercel Function (Serverless)
      ↓
┌─────────────────────────────┐
│ 1. Get Agent (briefingAgent)│
│ 2. Call Gemini API          │ → User gets response immediately
│ 3. Return response          │
└─────────────────────────────┘
      ↓
[Background]
      ↓
┌─────────────────────────────┐
│ Send logs to VoltOps        │
│ (async, doesn't block)      │
└─────────────────────────────┘
      ↓
VoltOps Console
(monitoring, tracing, analysis)
```

## 🚨 Edge Cases

### Если Gemini API медленный (>5 сек)
- Vercel обычно ждет 60 сек (Pro)
- Но лучше оптимизировать запрос
- VoltOps покажет где медленно

### Если VoltOps недоступна
- Логирование gracefully fails
- Ответ пользователю не задерживается
- Логи остаются в локальном логере

### Если превышен Vercel timeout
- Implement streaming response
- Разбить на несколько запросов
- Использовать background jobs (если Pro+)

## 📚 Дополнительно

- Документация Vercel: https://vercel.com/docs
- Документация Nuxt 3: https://nuxt.com/docs
- VoltOps Docs: https://voltagent.dev/docs/deployment/voltops/

## Checklista для Production

- [ ] Environment variables установлены в Vercel
- [ ] GitHub integration подключена
- [ ] VOLTAGENT_API_KEY скопирован из console.voltagent.dev
- [ ] Запущен первый deployment (vercel --prod)
- [ ] Логи появляются в VoltOps Console
- [ ] Протестирована Cabinet с live production
- [ ] Проверены performance metrics в Vercel
- [ ] Настроена мониторинг в VoltOps

Готово! 🚀
