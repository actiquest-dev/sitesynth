# AI Chat Feature Setup

## Overview
The AI Chat feature provides a floating chat button on all pages that allows users to interact with AI employees configured in NocoBase.

## Components

### Frontend Components
- **AIChatButton.vue**: Floating action button in bottom-right corner
- **AIChatDrawer.vue**: Chat interface drawer that slides in from the right
- **useAIChat.ts**: Composable for managing chat state and messages

### Backend
- **server/api/ai-chat.ts**: API endpoint that processes messages through NocoBase AI employees

## How It Works

1. **User clicks the floating chat button** → Chat drawer opens
2. **User types a message** → Message is sent to `/api/ai-chat`
3. **Backend processes message**:
   - Fetches AI employees from NocoBase (`ai_employees` collection)
   - Calls the AI employee with the user message and conversation history
   - Returns the AI response
4. **Response is displayed in chat** → User can continue the conversation

## Configuring AI Employees in NocoBase

### Required Table: `ai_employees`

The NocoBase database should have an `ai_employees` table with the following fields:

```
- id (Primary Key)
- name (Text) - Name of the AI employee
- role (Text) - Role/title of the employee
- system_prompt (LongText) - System prompt defining behavior
- is_active (Checkbox) - Whether the employee is active
- description (LongText) - Description of the employee
```

### Example AI Employee Configuration

```json
{
  "id": "emp_001",
  "name": "SiteSynth Assistant",
  "role": "Sales & Support",
  "system_prompt": "You are a helpful AI employee at SiteSynth. Help users with questions about our services, project requirements, design and development processes...",
  "is_active": true,
  "description": "Main support assistant for customer inquiries"
}
```

## API Integration

### Fetch AI Employees
```
GET /api/ai_employees:list
Headers: xc-auth: <NOCO_TOKEN>
```

### Call AI Employee
The endpoint attempts to call:
```
POST /api/ai_employees/{id}:call
Body: {
  "message": "user message",
  "conversationHistory": [...]
}
```

## Features

- ✅ Floating button on all pages
- ✅ Chat drawer with message history
- ✅ Auto-scroll to latest messages
- ✅ Loading state while waiting for response
- ✅ Error handling with fallback responses
- ✅ Dark theme matching site design
- ✅ Mobile responsive
- ✅ Conversation memory (within session)

## Customization

### Change Button Position
Edit `AIChatButton.vue` - modify the `fixed bottom-6 right-6` classes

### Change Colors
- Button: `bg-[#0033ff]` → Change primary blue color
- Header: `bg-[#0033ff]` → Update in AIChatDrawer.vue

### Change Default Responses
Edit `getDefaultAIResponse()` in `server/api/ai-chat.ts`

## Testing

### Test the Chat API
```bash
curl -X POST http://localhost:3000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "conversationHistory": []
  }'
```

### Test in Browser
1. Navigate to http://localhost:3000
2. Look for the blue floating button in the bottom-right
3. Click to open chat
4. Type a message and press Enter or click Send

## Troubleshooting

### Chat button not appearing
- Check that `app.vue` includes `<AIChatButton />` and `<AIChatDrawer />`
- Verify browser console for errors
- Check that components are properly imported

### API returns default response
- Verify NocoBase is running at `http://138.2.134.17:20000`
- Check that `ai_employees` table exists
- Verify `NOCO_TOKEN` is correct and has access
- Check server logs for API errors

### No response from AI
- Check that `getDefaultAIResponse()` is being called
- Verify message is being sent correctly via network tab
- Check that AI employee configuration is valid
