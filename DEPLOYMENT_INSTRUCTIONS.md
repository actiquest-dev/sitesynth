# Deployment Instructions - Anonymous Chat System

## Status: ✅ Code Deployed to Vercel

**Commit:** `d977a54` - Implement anonymous chat system with device-based tracking
**Repository:** https://github.com/actiquest-dev/sitesynth
**Vercel Status:** Automatically deploying...

---

## ⏳ CRITICAL: Database Migration Must Be Applied

The code is now deployed, but **the database migration MUST be applied to Supabase** before the system will work.

### Step 1: Apply Migration to Supabase

**Option A: Via Supabase Dashboard (Easiest)**

1. Go to https://supabase.com/dashboard
2. Select your project (sitesynth)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `/supabase/migrations/20260326_anonymous_chat_support.sql`
6. Paste into the SQL Editor
7. Click **Run**
8. Verify success message appears

**Option B: Via Supabase CLI**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Navigate to project directory
cd /Users/miguelaprossine/synth/sitesynth

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push

# Verify migration applied
supabase db list
```

### Step 2: Verify Migration Applied

In Supabase SQL Editor, run:

```sql
-- Check if columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'conversations'
AND column_name IN ('device_id', 'claim_token', 'claimed_at');

-- Expected result: 3 rows with device_id (UUID), claim_token (character varying), claimed_at (timestamp without time zone)
```

If you see the three columns, ✅ migration is successful!

---

## What the Migration Does

The migration file contains 14 steps:

1. **Add Columns:**
   - `device_id` - UUID for browser identification
   - `claim_token` - Secure token for conversion (256-bit)
   - `claimed_at` - Timestamp of conversion

2. **Schema Changes:**
   - Make `user_email` optional (was NOT NULL)
   - Add constraint: must have `device_id` OR `user_email`

3. **Performance:**
   - Create indexes on device_id, claim_token, claimed_at

4. **Security - RLS Policies:**
   - Anonymous users can only see their own device's conversations
   - Authenticated users can only see their own email's conversations
   - Block unauthorized access at database level

---

## Testing After Deployment

### Test 1: Verify Deployment is Live
```bash
curl https://sitesynth.com/
# Should return HTML (200 OK)
```

### Test 2: Test Anonymous Chat
1. Visit https://sitesynth.com (no login)
2. Open chat → should generate device_id
3. Check browser DevTools → Application → localStorage
4. Should see: `sitesynth_device_id` (UUID)
5. Send a message → should work
6. Refresh page → conversation should still be there

### Test 3: Test Registration & Claim
1. In anonymous chat: send some messages
2. Note the `sitesynth_claim_token` in localStorage
3. Go to confirmation page
4. Enter email → receive code → verify code
5. Check Supabase dashboard:
   - Find your conversation
   - Verify `user_email` is now set
   - Verify `claimed_at` has timestamp
   - Verify `claim_token` is NULL

### Test 4: Cross-Device Access
1. In Chrome: Create anonymous conversation, send messages
2. Register/complete verification
3. Open Firefox → login with same email
4. Navigate to Cabinet → Chat
5. Verify: Same conversation visible with all messages

---

## Monitoring Deployment

### Check Vercel Deployment Status
1. Go to https://vercel.com/dashboard
2. Select sitesynth project
3. Check build status (should be green/completed)

### Check for Errors

**Frontend Console:** https://sitesynth.com
- Open DevTools → Console
- Should see no errors about `useAnonymousChat` or `device_id`

**Server Logs:** Vercel Dashboard → Deployments → [latest] → Logs
- Look for errors in chat API endpoints
- Should show no errors from `/api/chat/conversations` or `/api/chat/messages`

**Database Logs:** Supabase Dashboard → Logs
- Check for RLS policy errors
- Should show successful queries to conversations/messages tables

---

## Rollback Instructions (If Needed)

If something goes wrong and you need to rollback:

1. **Revert Code Deployment:**
   ```bash
   git revert d977a54  # Reverts the commit
   git push origin main
   # Vercel will automatically redeploy previous version
   ```

2. **Revert Database Migration:**
   ```sql
   -- Drop RLS policies
   DROP POLICY IF EXISTS "anonymous_access_via_device" ON conversations;
   DROP POLICY IF EXISTS "authenticated_access_via_email" ON conversations;
   DROP POLICY IF EXISTS "create_anonymous_conversation" ON conversations;
   DROP POLICY IF EXISTS "create_authenticated_conversation" ON conversations;
   DROP POLICY IF EXISTS "claim_conversation_via_token" ON conversations;
   DROP POLICY IF EXISTS "messages_access_own_conversation" ON messages;
   DROP POLICY IF EXISTS "messages_insert_own_conversation" ON messages;

   -- Drop indexes
   DROP INDEX IF EXISTS idx_conversations_device_id;
   DROP INDEX IF EXISTS idx_conversations_claim_token;
   DROP INDEX IF EXISTS idx_conversations_claimed_status;

   -- Drop constraint
   ALTER TABLE conversations DROP CONSTRAINT IF EXISTS check_device_or_email;

   -- Drop columns
   ALTER TABLE conversations DROP COLUMN IF EXISTS device_id;
   ALTER TABLE conversations DROP COLUMN IF EXISTS claim_token;
   ALTER TABLE conversations DROP COLUMN IF EXISTS claimed_at;

   -- Restore user_email NOT NULL
   ALTER TABLE conversations ALTER COLUMN user_email SET NOT NULL;
   ```

---

## Troubleshooting

### Issue: "x-device-id header not recognized"
- **Cause:** Frontend not using updated components
- **Fix:** Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- **Check:** Verify code is deployed: `git log --oneline | head -1` should show commit d977a54

### Issue: "Conversation not found" when messaging
- **Cause:** Migration not applied OR RLS policies blocking access
- **Fix:** Run migration verification query above
- **Check:** Verify RLS policies exist: `SELECT * FROM pg_policies WHERE tablename = 'conversations';`

### Issue: "claim_token already exists" error
- **Cause:** Duplicate token generated (extremely rare)
- **Fix:** Restart conversation, generate new token
- **Check:** Contact support if persists

### Issue: User can see other users' conversations
- **Cause:** RLS policies not enabled OR not blocking correctly
- **Fix:** Run migration again or check policy syntax
- **Verify:** `SELECT * FROM conversations WHERE user_email = 'test@example.com' -- Should only return user's conversations`

---

## Environment Variables Check

Ensure these are set on Vercel:

```env
# Supabase
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Stripe (if using payment flow)
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...

# Other required vars
NUXT_PUBLIC_API_BASE=/api
NODE_ENV=production
```

To set/verify on Vercel:
1. Go to https://vercel.com/dashboard
2. Select sitesynth project
3. Settings → Environment Variables
4. Verify all vars are set

---

## Success Checklist

After applying migration and verifying deployment:

- [ ] Code deployed to Vercel (check commit d977a54)
- [ ] Database migration applied to Supabase
- [ ] Migration verification query returns 3 columns
- [ ] RLS policies exist: `SELECT * FROM pg_policies...`
- [ ] Anonymous chat test passes (device_id generated)
- [ ] Message persistence test passes (refresh persists chat)
- [ ] Registration & claim test passes (conversation linked)
- [ ] Cross-device test passes (same conversation on different browser)
- [ ] No console errors on sitesynth.com
- [ ] Vercel deployment shows green/success status

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase database logs
3. Review troubleshooting section above
4. Check browser console for errors
5. Verify environment variables are set
6. Verify migration was applied successfully

---

## Timeline

- ✅ Code changes completed and tested
- ✅ Code committed and pushed to GitHub
- ✅ Vercel deployment triggered automatically
- ⏳ **NEXT:** Apply database migration to Supabase
- ⏳ Verify migration success
- ⏳ Run comprehensive tests
- ⏳ Monitor production for 24 hours

---

**Deployment Date:** 2026-03-25
**Deployed By:** Claude Opus
**Status:** Code deployed, awaiting database migration

