# VoltOps Integration Setup

## Overview
SiteSynth is now fully integrated with VoltOps Console for AI agent observability, monitoring, and management.

## What You Get

✅ **Real-time Agent Monitoring**
- Track all agent interactions (briefing + consultant)
- View execution times and performance metrics
- Monitor error rates and failures

✅ **Conversation Tracing**
- Deep dive into each conversation
- See full execution traces with timing
- Debug agent behavior

✅ **Agent Management**
- Edit agent instructions in the console
- Update system prompts without redeploying
- A/B test different behaviors

✅ **Logs & Debugging**
- All agent interactions logged
- Structured logging with context
- Filter by mode, agent, user, etc.

✅ **Performance Analytics**
- Response times & latency
- Token usage
- Error tracking
- Conversation patterns

## Setup Instructions

### 1. Get VoltOps API Key

Visit https://console.voltagent.dev and sign up:
1. Create account (free tier available)
2. Create a project called "SiteSynth"
3. Copy the API key

### 2. Configure Environment

Add to `.env.local`:
```bash
# VoltOps Integration
VOLTAGENT_API_KEY=your_api_key_here
VOLTAGENT_PROJECT_ID=sitesynth
LOG_LEVEL=info  # debug for more verbose logging
```

### 3. Start Server

```bash
cd ~/synth/sitesynth
npm run dev
```

You should see in the console:
```
🚀 Initializing VoltAgent runtime
✅ Registered 2 agents
🔗 VoltOps telemetry enabled
```

### 4. Access VoltOps Dashboard

Open: https://console.voltagent.dev

You should see:
- **Project**: SiteSynth
- **Agents**:
  - Viz - Briefing Specialist (active mode)
  - Viz - General Consultant (passive mode)

## Using VoltOps Console Features

### Monitoring Dashboard
- See all conversations in real-time
- Monitor agent health
- Check response times

### Agent Traces
- Click any conversation to see detailed trace
- View system prompts used
- See input/output
- Check execution timeline

### Logs
- Filter by agent type
- Filter by mode (active/passive)
- Filter by user ID
- Search by keywords

### Prompt Editing
1. Go to **Agents** section
2. Click agent name
3. Edit instructions
4. Changes apply immediately (no redeploy)

## Logging Architecture

### Log Levels
- `debug`: Detailed execution flow (development)
- `info`: Important events (default)
- `warn`: Issues that recovered
- `error`: Failed operations

### Available Logs

**Chat Initialization**
```
🤖 [ACTIVE] Processing chat request
  - agent: Viz - Briefing Specialist
  - mode: active
  - userId: user_123
```

**Agent Execution**
```
🔄 Calling VoltAgent
  - messageLength: 45
  - historySize: 3
```

**Completion**
```
✅ Agent response received
  - responseLength: 156
  - executionTime: 1234ms
```

**Errors**
```
❌ Agent execute failed, falling back to direct API
  - error: timeout
```

## Metrics Available in VoltOps

- **Response Time**: How long agent takes to respond
- **Token Usage**: LLM tokens consumed
- **Success Rate**: % of successful executions
- **Error Rate**: % of failed executions
- **Cache Hit Rate**: How often responses are cached
- **User Engagement**: Conversation length & frequency

## Troubleshooting

### Logs Not Appearing in VoltOps

1. Check `.env.local` has `VOLTAGENT_API_KEY`
2. Restart server: `npm run dev`
3. Look for errors in server console
4. Check firewall isn't blocking outbound to VoltOps

### API Key Invalid

```
⚠️ VoltOps telemetry disabled. Set VOLTAGENT_API_KEY to enable observability.
```

Solution:
1. Go to https://console.voltagent.dev
2. Check project settings
3. Copy correct API key
4. Update `.env.local`
5. Restart server

### High Response Times

Use **Traces** tab in VoltOps to:
1. See where time is spent
2. Check if Google API is slow
3. Verify conversation context isn't too large
4. Monitor system load

## Best Practices

### For Development
```bash
LOG_LEVEL=debug  # See full execution flow
```

### For Production
```bash
LOG_LEVEL=info   # Less noise, focus on events
```

### Monitoring Health
1. Check logs every 30min during launch
2. Watch error rate in dashboard
3. Review slow conversations in traces
4. Monitor token usage and costs

## Example: Debugging a Failed Interaction

1. Open VoltOps Console → Logs
2. Filter by mode: `active` (if Cabinet issue)
3. Find conversation with ❌ symbol
4. Click to view trace
5. See:
   - Exact user message
   - Agent response attempt
   - Error message
   - Execution time
6. Fix issue (update instruction, fix prompt, etc.)

## Architecture

```
┌─────────────┐
│ Cabinet     │
│ Website     │ ── POST /api/ai-chat ──┐
└─────────────┘                        │
                                       ▼
                            ┌──────────────────┐
                            │  Nitro Endpoint  │
                            │  (ai-chat.ts)    │
                            └──────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                    ┌─────────┐         ┌──────────────┐
                    │ VoltOps │         │ Google       │
                    │ Logger  │         │ Gemini API   │
                    │ Telemetry         │ (LLM Response)
                    └─────────┘         └──────────────┘
                         │
                         ▼
                   https://console.voltagent.dev
                   (Dashboard & Monitoring)
```

The VoltAgent runtime (`/server/voltagent/index.ts`) manages:
- Agent registry
- Logging with structure
- Telemetry collection
- VoltOps integration

## Next Steps

1. **Start monitoring**: Open VoltOps and watch live conversations
2. **Set up alerts**: Configure thresholds for errors (in VoltOps)
3. **A/B testing**: Use prompt editor to test different agent instructions
4. **Optimize**: Use metrics to improve agent performance

For more info: https://voltagent.dev/docs/
