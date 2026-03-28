# Reference Pipeline (Competitive Landscape & Screenshots)

This doc describes how the Reference Analysis pipeline works end-to-end: API endpoints, worker, capture service, storage, and UI. It also shows where logs are written and how to debug failures.

## High-level flow

1. User clicks Analyze References in the cabinet.
2. API enqueues a job in reference_jobs (Supabase).
3. Oracle reference-worker picks the job and runs the pipeline.
4. Pipeline captures screenshots via reference-capture service.
5. Screenshots are uploaded to Google Drive and analyzed by Gemini.
6. Results are written to briefs.reference_analysis_json and brief_reference_assets.
7. Cabinet polls status and shows logs + screenshots.

## UI (Cabinet)

File: /Users/miguelaprossine/synth/sitesynth/pages/cabinet.vue

### Reference section
- Button Analyze References calls analyzeReferences().
- Auto-polling while status is queued/processing.
- Renders:
  - Reference Pipeline stepper (Discovery -> Capture -> Upload -> Analyze -> Summary)
  - Reference Logs (from reference_analysis_json.logs)
  - Captured assets (from brief_reference_assets)

### Re-analyze behavior
On re-analyze we force a clean run:
- Frontend clears referenceAnalysis, referenceAssets, referenceLogs and sets referenceStatus = processing.
- Sends { force: true } to API.

## API Endpoints

### POST /api/briefs/references/run
File: /Users/miguelaprossine/synth/sitesynth/server/api/briefs/references/run.post.ts

- Validates x-user-email + briefId.
- Enqueues a job in reference_jobs.
- If force: true:
  - cancels any existing queued/running jobs for the brief
  - deletes brief_reference_assets
  - clears briefs.reference_analysis_json.logs
  - sets briefs.reference_status = queued
- Returns { jobId, status }.

### GET /api/briefs/references/status
File: /Users/miguelaprossine/synth/sitesynth/server/api/briefs/references/status.get.ts

Returns:
- status (pending | queued | processing | completed | failed)
- analysis (briefs.reference_analysis_json)
- assets (brief_reference_assets)
- logs (reference_analysis_json.logs)
- job (latest reference_jobs entry)

### Debug
/api/debug/capture-config
- Shows environment + capture config (baseUrl, tokenPresent).

## Worker

File: /Users/miguelaprossine/synth/sitesynth/workers/reference-worker.ts

- Runs as a systemd service on Oracle.
- Polls reference_jobs and claims the oldest queued job.
- Calls runReferenceAnalysisPipeline().
- Writes progress logs into briefs.reference_analysis_json.logs.

### Systemd service (Oracle)
/etc/systemd/system/reference-worker.service

Start/stop:
- sudo systemctl restart reference-worker
- sudo journalctl -u reference-worker -n 200 --no-pager

## Core Pipeline

File: /Users/miguelaprossine/synth/sitesynth/server/utils/reference-research.ts

### Main entry
runReferenceAnalysisPipeline({ briefId, userEmail, markdownContent })

Steps and log phases:
1) Discovery
   - Gemini analyzes brief -> competitor archetype + search queries.
   - Curated shortlist merged with web discovery.
   - Logs:
     - Starting reference discovery
     - Discovered N candidate URLs
2) Capture
   - Calls reference-capture service (per URL).
   - Logs:
     - Requesting capture for <url>
     - Captured N screenshots for <url>
     - Capture failed for <url>
3) Upload
   - Uploads screenshots to Google Drive.
4) Analyze
   - Gemini analyzes each screenshot.
5) Summary
   - Gemini generates visual direction summary.
   - Summary is merged into brief markdown.

### Logs structure
Saved to briefs.reference_analysis_json.logs:

{ ts, level, message, phase?, payload? }

Phases: discovery | capture | upload | analyze | summary.

### Capture service
Called from: callCaptureService() in reference-research.ts

Config:
- REFERENCE_CAPTURE_SERVICE_URL (prod uses https://mcp.sitesynth.com/reference_capture)
- REFERENCE_CAPTURE_TOKEN

## Storage

### Supabase tables
- briefs
  - reference_status
  - reference_analysis_json
- brief_reference_assets
- reference_jobs

### Google Drive
Uploads in folder structure:
Brief_<briefId>/Competitor_References/<competitor>/

## Common failures & debugging

### 1) No screenshots
Error: Reference capture returned no screenshots

Check:
- reference-capture service logs
- token present in /api/debug/capture-config
- verify URLs are reachable (captcha, block, etc.)

### 2) Worker stuck in running
- Inspect reference-worker logs
- Restart worker
- Force re-analyze with { force: true }

### 3) Logs missing in UI
- Check that reference_analysis_json.logs is updated in Supabase
- UI polls /api/briefs/references/status every 5s when processing

## File map (quick reference)

- UI: /Users/miguelaprossine/synth/sitesynth/pages/cabinet.vue
- API run: /Users/miguelaprossine/synth/sitesynth/server/api/briefs/references/run.post.ts
- API status: /Users/miguelaprossine/synth/sitesynth/server/api/briefs/references/status.get.ts
- Pipeline: /Users/miguelaprossine/synth/sitesynth/server/utils/reference-research.ts
- Worker: /Users/miguelaprossine/synth/sitesynth/workers/reference-worker.ts
- Debug config: /Users/miguelaprossine/synth/sitesynth/server/api/debug/capture-config.get.ts
- Migration (reference_jobs): /Users/miguelaprossine/synth/sitesynth/supabase/migrations/20260328133000_create_reference_jobs.sql
