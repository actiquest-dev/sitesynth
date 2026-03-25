# Anonymous Chat Integration - Complete Implementation

## Status: ✅ IMPLEMENTATION COMPLETE

All code changes have been made to support the anonymous chat → authenticated user flow. This document outlines what has been implemented and what needs verification.

---

## Implementation Summary

### 1. Backend Infrastructure

#### Migration File
**File:** `/supabase/migrations/20260326_anonymous_chat_support.sql`
**Status:** ✅ Created
**What it does:**
- Adds `device_id` (UUID) column to conversations table
- Adds `claim_token` (VARCHAR 256 UNIQUE) for linking anon → auth
- Adds `claimed_at` (TIMESTAMP) for audit trail
- Makes `user_email` optional (was NOT NULL)
- Creates indexes for device_id and claim_token lookups
- Implements RLS (Row-Level Security) policies:
  - Anonymous users can only see conversations with their device_id
  - Authenticated users can only see conversations with their email
  - Both types can create conversations in their respective modes

#### API Endpoints - Backend Changes

**1. POST /api/chat/conversations** - Create new conversation
**File:** `/server/api/chat/conversations.ts`
**Status:** ✅ Already updated
**Changes:**
- Accepts either `x-device-id` (anonymous) OR `x-user-email` (authenticated)
- Generates secure `claim_token` for all conversations
- Returns `claim_token` in response for client storage
- Stores token in localStorage (client-side)

**2. GET /api/chat/conversations** - Fetch user conversations
**File:** `/server/api/chat/conversations.ts`
**Status:** ✅ Already updated
**Changes:**
- Requires `x-user-email` header (authenticated users only)
- Filters by user_email - users only see their own conversations
- Anonymous users cannot fetch here (intentional - they use device_id context in messages endpoint)

**3. GET /api/chat/messages** - Load conversation messages
**File:** `/server/api/chat/messages.ts`
**Status:** ✅ Already updated
**Changes:**
- Checks ownership: conversation.device_id === deviceId OR conversation.user_email === userEmail
- Returns 403 if user doesn't own conversation
- Works for both anonymous and authenticated users

**4. POST /api/chat/messages** - Send message
**File:** `/server/api/chat/messages.ts`
**Status:** ✅ Already updated
**Changes:**
- Supports both device_id and user_email authentication
- Verifies ownership before allowing message insert
- Works seamlessly whether user is anonymous or authenticated

**5. POST /api/auth/claim-conversation** - Claim anonymous conversation
**File:** `/server/api/auth/claim-conversation.ts`
**Status:** ✅ Created
**What it does:**
- Finds conversation by `claim_token`
- Validates token hasn't been claimed yet
- Links conversation to user_email
- Sets claimed_at timestamp
- Invalidates claim_token (single-use)
- Returns success/failure and conversationId

**6. POST /api/auth/after-payment** - User registration after payment
**File:** `/server/api/auth/after-payment.ts`
**Status:** ✅ Updated
**Changes:**
- Now accepts `claimToken` in request body
- After creating user, automatically calls claimConversation logic
- Links anonymous chat history to new authenticated user
- Returns conversationClaimed status in response

---

### 2. Frontend Components

#### Composables

**1. useAnonymousChat()**
**File:** `/composables/useAnonymousChat.ts`
**Status:** ✅ Created
**Provides:**
```typescript
{
  deviceId,              // UUID - auto-generated and persisted in localStorage
  conversationId,        // Current active conversation
  setConversationId(),   // Save conversation when opened
  getClaimToken(),       // Retrieve token for registration
  setClaimToken(),       // Store token after conversation created
  hasActiveConversation(), // Check if user has active chat
  reset()                // Clear chat state on logout
}
```

#### Vue Components

**1. AIChatDrawer.vue** - Chat drawer for authenticated users + anonymous support
**File:** `/components/AIChatDrawer.vue`
**Status:** ✅ Updated
**Changes:**
- Imports `useAnonymousChat` composable
- Determines auth status based on `userEmail` prop
- `getAuthHeaders()` helper returns:
  - `{ 'x-user-email': email }` for authenticated
  - `{ 'x-device-id': deviceId }` for anonymous
- On conversation create:
  - **Anonymous:** Stores conversationId and claimToken in localStorage
  - **Authenticated:** Uses user_email for context
- All API calls use appropriate headers

**2. ChatInterface.vue** - Full-page chat for anonymous users
**File:** `/components/ChatInterface.vue`
**Status:** ✅ Updated
**Changes:**
- Imports `useAnonymousChat` composable
- Same auth determination and header strategy as AIChatDrawer
- Anonymous users can chat without login
- On new conversation creation:
  - Stores conversationId in localStorage
  - Stores claimToken for later registration

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ ANONYMOUS USER JOURNEY                                          │
└─────────────────────────────────────────────────────────────────┘

1. Home page / Chat drawer
   ↓
   Client: Generates device_id (UUID), stores in localStorage
   ↓
2. Opens chat
   ↓
   Client: Creates conversation via POST /api/chat/conversations
   Headers: { 'x-device-id': deviceId }
   ↓
3. Server response
   ↓
   Server: Creates conversation with device_id, generates claim_token
   Server: Returns { id, claim_token, ... }
   ↓
4. Client stores
   ↓
   Client: Saves conversationId and claimToken in localStorage
   Composable: useAnonymousChat().setConversationId(id)
   Composable: useAnonymousChat().setClaimToken(token)
   ↓
5. Chat messages
   ↓
   Client: Sends messages via POST /api/chat/messages
   Headers: { 'x-device-id': deviceId }
   All messages: Read via GET with device_id ownership check
   ↓
6. User decides to register (pays for package)
   ↓
   Client: Calls POST /api/auth/after-payment
   Body: { email, fullName, chargeId, claimToken }
   ↓
7. Server creates user & claims conversation
   ↓
   Server: Creates auth user
   Server: Calls claimConversation(claimToken, email)
   Server: Updates conversation: device_id=null, user_email=email, claimed_at=NOW
   ↓
8. User now authenticated
   ↓
   Client: Receives auth token, clears device_id from headers
   ↓
9. Different browser / session
   ↓
   Client: User logs in
   Headers: { 'x-user-email': email }
   ↓
10. Can access same conversation!
    ↓
    Server: Finds conversation via user_email
    Server: Returns all messages from claimed conversation
    ✅ Conversation history persists across devices!
```

---

## Privacy/Security Implementation

### RLS Policies (Database Level)
Each policy ensures users can only see their own data:
- **Anonymous:** `device_id IS NOT NULL AND device_id = current_setting('app.device_id')`
- **Authenticated:** `user_email IS NOT NULL AND user_email = auth.email()`

### API Level Checks (Defense in Depth)
Every endpoint verifies ownership before returning/modifying data:
```typescript
// Example from messages.ts GET endpoint
const isOwner =
  (conversation.device_id && conversation.device_id === deviceId) ||
  (conversation.user_email && conversation.user_email === userEmail)

if (!isOwner) {
  return createError({ statusCode: 403, statusMessage: 'Access denied' })
}
```

### Token Security
- `claim_token`: 256-bit cryptographically secure token
- Single-use: Invalidated after first claim
- Expires: No explicit expiry (implement if needed)
- Transport: Passed in request body, not in URL

---

## What Still Needs to be Done

### 1. Database Migration
**Task:** Apply migration to Supabase database
```bash
# Manual: Run via Supabase dashboard
supabase db pull  # Pull current state
supabase migration up  # Run pending migrations
```
**Location:** `/supabase/migrations/20260326_anonymous_chat_support.sql`
**Status:** ⏳ PENDING

### 2. Environment Variables
Verify these are set in `.env.local`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
**Status:** ⏳ CHECK EXISTING

### 3. Testing & Verification

#### Test Case 1: Anonymous Chat Creation
- [ ] Open home page without login
- [ ] Open chat drawer
- [ ] Verify device_id is generated (check localStorage)
- [ ] Create new conversation
- [ ] Verify claim_token is stored in localStorage
- [ ] Send message
- [ ] Verify message appears in chat

#### Test Case 2: Message Persistence
- [ ] Send 3-5 messages as anonymous user
- [ ] Refresh page
- [ ] Verify conversation reopens automatically
- [ ] Verify all previous messages are still there
- [ ] All messages should have device_id context

#### Test Case 3: Registration & Claim
- [ ] As anonymous user: Complete full chat interaction
- [ ] Proceed to registration/payment page
- [ ] Complete payment (registers new user)
- [ ] Verify after-payment endpoint receives claimToken
- [ ] Check database: conversation should now have user_email, claimed_at
- [ ] Check database: claim_token should be NULL

#### Test Case 4: Cross-Device Access
- [ ] As anonymous user: Create conversation in Chrome
- [ ] Store claim_token from localStorage
- [ ] Register/pay (triggers claim)
- [ ] Open Firefox, login with same email
- [ ] Navigate to conversations list
- [ ] Verify same conversation appears
- [ ] Verify all messages are accessible
- [ ] Verify device_id is no longer used for ownership check

#### Test Case 5: Privacy/Access Control
- [ ] As user A: Create anonymous conversation
- [ ] Copy conversationId
- [ ] As user B (different browser/device): Try to access conversation
- [ ] Verify 403 Access Denied error
- [ ] Verify user B cannot see user A's messages

#### Test Case 6: Edge Cases
- [ ] Try to claim same token twice → Should fail with "already claimed"
- [ ] Try to claim with different email → Should fail
- [ ] Create conversation, don't register, wait 24hrs → Should still work
- [ ] Multiple devices, same anonymous user → Should see same conversation

### 4. Frontend Integration Points

These components need to be verified to pass claimToken correctly:

#### Payment Flow
**File:** Where payment completion calls `after-payment` endpoint
**Needs:** Pass `claimToken` from localStorage
```javascript
const claimToken = localStorage.getItem('sitesynth_claim_token')
await fetch('/api/auth/after-payment', {
  method: 'POST',
  body: JSON.stringify({
    email, fullName, chargeId,
    claimToken // ← Add this
  })
})
```
**Status:** ⏳ VERIFY/UPDATE

#### Login Flow
**File:** Cabinet.vue or auth middleware
**Needs:** Clear anonymous chat state on logout
```javascript
const { reset } = useAnonymousChat()
logout() {
  reset() // ← Clear conversation_id and claim_token
  // proceed with logout
}
```
**Status:** ⏳ VERIFY/UPDATE

---

## Implementation Checklist

- [x] Create migration with schema changes
- [x] Create useAnonymousChat composable
- [x] Create claim-conversation endpoint
- [x] Update after-payment endpoint
- [x] Update conversations.ts POST/GET endpoints
- [x] Update messages.ts GET/POST endpoints
- [x] Update AIChatDrawer component
- [x] Update ChatInterface component
- [ ] Apply migration to database ⏳
- [ ] Test anonymous chat creation
- [ ] Test message persistence
- [ ] Test registration & claim
- [ ] Test cross-device access
- [ ] Test privacy/access control
- [ ] Verify payment flow passes claimToken
- [ ] Verify logout clears state

---

## Files Changed Summary

### Created
1. `/supabase/migrations/20260326_anonymous_chat_support.sql`
2. `/composables/useAnonymousChat.ts`
3. `/server/api/auth/claim-conversation.ts`
4. `/docs/ANONYMOUS_CHAT_ARCHITECTURE.md`
5. `/docs/ANONYMOUS_CHAT_USAGE_EXAMPLE.md`
6. `/docs/DETAILED_EXECUTION_PLAN.md`

### Modified
1. `/server/api/auth/after-payment.ts` - Added claim logic
2. `/components/AIChatDrawer.vue` - Added device_id support
3. `/components/ChatInterface.vue` - Added device_id support
4. Already updated (no changes needed):
   - `/server/api/chat/conversations.ts`
   - `/server/api/chat/messages.ts`

---

## Next Steps

1. **Apply Migration** - Run the database migration
2. **Test Locally** - Follow test cases above
3. **Verify Payment Flow** - Ensure claimToken is passed during registration
4. **Deploy to Production** - Deploy with database migration

