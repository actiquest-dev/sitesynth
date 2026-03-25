-- Add device_id and claim_token to conversations for anonymous chat support
-- Allows anonymous users to chat before registration, then claim conversation after signup

-- Step 1: Add new columns
ALTER TABLE conversations
  ADD COLUMN device_id UUID,
  ADD COLUMN claim_token VARCHAR(256) UNIQUE,
  ADD COLUMN claimed_at TIMESTAMP;

-- Step 2: Make user_email optional (was NOT NULL before)
ALTER TABLE conversations
  ALTER COLUMN user_email DROP NOT NULL;

-- Step 3: Add constraint: must have device_id OR user_email (not empty)
ALTER TABLE conversations
  ADD CONSTRAINT check_device_or_email CHECK (device_id IS NOT NULL OR user_email IS NOT NULL);

-- Step 4: Create indexes for fast lookups
CREATE INDEX idx_conversations_device_id ON conversations(device_id);
CREATE INDEX idx_conversations_claim_token ON conversations(claim_token);
CREATE INDEX idx_conversations_claimed_status ON conversations(claimed_at);

-- Step 5: Add column comments explaining purpose
COMMENT ON COLUMN conversations.device_id IS 'Browser device identifier (UUID) for anonymous sessions. Generated client-side, persisted in localStorage. Allows same-browser conversation continuity before authentication.';

COMMENT ON COLUMN conversations.user_email IS 'User email address. NULL while anonymous, populated after authentication/claim.';

COMMENT ON COLUMN conversations.claim_token IS 'Secure token for linking anonymous conversation to authenticated user. Generated during anon conversation creation, used during registration to claim all anon history.';

COMMENT ON COLUMN conversations.claimed_at IS 'Timestamp when anonymous session was claimed/converted to authenticated session. NULL until claimed.';

-- Step 6: Enable RLS (Row Level Security) for privacy enforcement
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 7: RLS Policy - Anonymous access via device_id
-- Anonymous users can see conversations they created with their device_id
CREATE POLICY "anonymous_access_via_device"
ON conversations
FOR SELECT
USING (
  device_id IS NOT NULL
  AND device_id::TEXT = current_setting('app.device_id', true)
);

-- Step 8: RLS Policy - Authenticated access via user_email
-- Authenticated users can see conversations linked to their email
CREATE POLICY "authenticated_access_via_email"
ON conversations
FOR SELECT
USING (
  user_email IS NOT NULL
  AND user_email = auth.email()
);

-- Step 9: RLS Policy - Create anonymous conversation
CREATE POLICY "create_anonymous_conversation"
ON conversations
FOR INSERT
WITH CHECK (device_id IS NOT NULL);

-- Step 10: RLS Policy - Create authenticated conversation
CREATE POLICY "create_authenticated_conversation"
ON conversations
FOR INSERT
WITH CHECK (user_email IS NOT NULL AND user_email = auth.email());

-- Step 11: RLS Policy - Claim conversation (anon → auth)
-- Users can claim (update) anon conversations using claim_token
CREATE POLICY "claim_conversation_via_token"
ON conversations
FOR UPDATE
USING (claim_token IS NOT NULL AND claimed_at IS NULL)
WITH CHECK (user_email = auth.email() AND claimed_at IS NULL);

-- Step 12: RLS Policy - Messages: access own conversation
-- Users can read messages only from conversations they own (device OR email)
CREATE POLICY "messages_access_own_conversation"
ON messages
FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE
      (device_id IS NOT NULL AND device_id::TEXT = current_setting('app.device_id', true))
      OR (user_email IS NOT NULL AND user_email = auth.email())
  )
);

-- Step 13: RLS Policy - Messages: insert to own conversation
CREATE POLICY "messages_insert_own_conversation"
ON messages
FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations WHERE
      (device_id IS NOT NULL AND device_id::TEXT = current_setting('app.device_id', true))
      OR (user_email IS NOT NULL AND user_email = auth.email())
  )
);

-- Step 14: Enable RLS on documents, workflows if needed
-- (keeping existing schema for now, can add more granular control later)
