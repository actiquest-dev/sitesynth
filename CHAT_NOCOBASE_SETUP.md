# Chat History & Context NocoBase Setup

This document explains how to set up the chat history and context storage in NocoBase.

## Overview

The AI Chat feature now supports persistent storage of:
1. **Chat Messages** - Stores user and assistant messages in the `ChatHistory` table
2. **Conversation Context** - Stores conversation metadata in the `ChatContext` table

Both tables are automatically created and managed via the API endpoints.

## Setup Steps

### Step 1: Access NocoBase

Open NocoBase at: http://138.2.134.17:20000

### Step 2: Create ChatHistory Table (Manual)

1. Click **"Add Base"** or open your existing base
2. Create a new table called **`ChatHistory`** with these columns:

| Column Name | Type | Required | Notes |
|------------|------|----------|-------|
| `id` | Number (ID) | Yes | Auto-increment |
| `userEmail` | Text | Yes | User's email from auth token |
| `role` | Text | Yes | "user" or "assistant" |
| `content` | Long Text | Yes | The message content |
| `timestamp` | DateTime | Yes | When message was created |

**SQL:**
```sql
CREATE TABLE ChatHistory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userEmail VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  content LONGTEXT NOT NULL,
  timestamp DATETIME NOT NULL,
  INDEX idx_user_timestamp (userEmail, timestamp)
);
```

### Step 3: Create ChatContext Table (Manual)

1. Create a new table called **`ChatContext`** with these columns:

| Column Name | Type | Required | Notes |
|------------|------|----------|-------|
| `id` | Number (ID) | Yes | Auto-increment |
| `userEmail` | Text | Yes | User's email from auth token |
| `contextData` | Long Text | Yes | JSON string of context object |
| `updatedAt` | DateTime | Yes | Last update timestamp |

**SQL:**
```sql
CREATE TABLE ChatContext (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userEmail VARCHAR(255) NOT NULL UNIQUE,
  contextData LONGTEXT NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_user (userEmail)
);
```

### Step 4: Verify API Integration

The API endpoints are already configured to use these tables:

- **Load messages**: `POST /api/chat-history` with `{ action: "load" }`
- **Save messages**: `POST /api/chat-history` with `{ action: "save", messages: [...] }`
- **Load context**: `POST /api/chat-history` with `{ action: "load-context" }`
- **Save context**: `POST /api/chat-history` with `{ action: "save-context", context: {...} }`

## How It Works

### Chat Flow

1. **User opens chat** → `initializeChat()` loads messages and context from NocoBase
2. **User sends message** → Message is sent to AI API
3. **AI responds** → Response is added to messages list
4. **Auto-save** → `saveChatMessages()` and `saveContext()` persist to NocoBase

### Data Structure

**ChatHistory Table:**
```json
{
  "id": 1,
  "userEmail": "user@example.com",
  "role": "user",
  "content": "What services do you offer?",
  "timestamp": "2024-02-26T10:30:00Z"
}
```

**ChatContext Table:**
```json
{
  "id": 1,
  "userEmail": "user@example.com",
  "contextData": "{\"page\": \"/cabinet\", \"projectId\": \"123\", \"context\": \"User is viewing Projects Cabinet\", \"userProjects\": \"Projects: 2 total...\"}",
  "updatedAt": "2024-02-26T10:30:00Z"
}
```

## Authentication

All requests to `/api/chat-history` require an `Authorization` header with the user's JWT token:

```
Authorization: Bearer <jwt_token>
```

The server extracts the user's email from the token and ensures they can only access their own data.

## Error Handling

- If tables don't exist, the API will return an error
- If context saving fails, it won't block the chat (non-critical)
- If message loading fails, the chat starts empty (non-critical)

## Testing

1. Open the chat on any page
2. Send a message
3. Refresh the page
4. Open the chat again - your message history should be loaded!

## Environment Variables

Make sure these are set in `.env.local`:

```
NOCO_BASE_URL=http://138.2.134.17:20000
NOCO_TOKEN=your_nocobase_token_here
```

## Troubleshooting

### Messages not saving?
- Check that `ChatHistory` table exists in NocoBase
- Verify `NOCO_BASE_URL` and `NOCO_TOKEN` are correct
- Check browser console for errors

### Context not loading?
- The `ChatContext` table may not exist (it's created on first save)
- Context is non-critical, so missing context won't break the chat
- Manually create the table following Step 3 if needed

### Can't see messages after refresh?
- Open browser DevTools (F12)
- Check Network tab - look for `/api/chat-history` requests
- Check Console for any JavaScript errors
- Verify auth token is being sent in headers

## Future Enhancements

- [ ] Add automatic table creation endpoint
- [ ] Add message search functionality
- [ ] Add conversation tagging/categorization
- [ ] Add conversation export feature
- [ ] Add message deletion/archiving
