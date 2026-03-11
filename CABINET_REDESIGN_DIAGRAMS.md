# CABINET REDESIGN - Визуальные диаграммы

## 1. User Journey Map (Текущий vs Требуемый)

### ТЕКУЩИЙ ПРОЦЕСС ❌
```
User Login
    ↓
Cabinet Page
    ↓
Sees: Orders Section (empty) 
      Projects Section (empty)
      Account Settings
    ↓
User: "What do I do now?" 😕
    ↓
Dead End - User bounces
```

### ТРЕБУЕМЫЙ ПРОЦЕСС ✅
```
User Login
    ↓
Cabinet Dashboard (Welcome + Quick Stats)
    ↓
👉 CTA: "Create New Brief"
    ↓
┌─ STAGE 1: Upload Files ─────┐
│ (25% progress)              │
│ Drag-drop files             │
│ Brand guidelines, wireframes │
│ References, docs            │
└─────────────────────────────┘
    ↓
┌─ STAGE 2: Talk to AI ───────┐
│ (50% progress)              │
│ AgentResponses questionnaire  │
│ 5-7-message exchange        │
│ AI extracts key data        │
└─────────────────────────────┘
    ↓
┌─ STAGE 3: Generate ────────┐
│ (75% progress)             │
│ AI synthesizes brief       │
│ Combines: files + chat     │
│ Creates 8-section output   │
└────────────────────────────┘
    ↓
┌─ STAGE 4: Review & Edit ──┐
│ (90% progress)            │
│ User reads all 8 sections │
│ Edits/tweaks as needed    │
│ Generates PDF             │
└────────────────────────────┘
    ↓
┌─ STAGE 5: Save & Export ──┐
│ (100% progress) ✅        │
│ Brief saved to DB         │
│ Available for download    │
│ Can regenerate/edit later │
└────────────────────────────┘
    ↓
✨ Success!
```

---

## 2. Cabinet Architecture Diagram

```
                    CABINET HOME
                   ┌──────────────┐
                   │  Dashboard   │
                   │  Welcome box │
                   │  Stats card  │
                   │  Recent list │
                   └──────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    [Briefs]         [Conversations]   [Files]
    Brief list       List of past      Upload
    with status      chats with        & manage
                     AI agents         files
    
    [Create]         [Link Brief]      [Settings]
    new brief        to conversation   Account &
                     & regenerate      API config
```

---

## 3. Data Flow Diagram

```
USER UPLOADS FILES
        │
        ↓
┌──────────────────┐
│ File Storage     │
│ (Supabase)       │
│                  │
│ - PDF docs       │
│ - Wireframes     │
│ - Guidelines     │
│ - References     │
└──────────────────┘
        │
        ↓
USER CONVERSES WITH AGENT
        │
        ↓
┌──────────────────┐
│ Chat Messages    │
│ (Supabase)       │
│                  │
│ - User Q&A       │
│ - AI Responses   │
│ - Extract Data   │
└──────────────────┘
        │
        ├─────────────────┐
        │                 │
        ↓                 ↓
┌──────────────┐  ┌──────────────┐
│ Files Text   │  │ BriefData    │
│ Extraction   │  │ Extraction   │
│              │  │              │
│ Read & parse │  │ Keyword      │
│ files        │  │ detection    │
│ Content      │  │ Structure    │
└──────────────┘  └──────────────┘
        │                 │
        └────────┬────────┘
                 │
                 ↓
        ┌─────────────────┐
        │ generateBrief() │
        │                 │
        │ Input:          │
        │ • Extracted     │
        │   file content  │
        │ • Conversation  │
        │ • User email    │
        │                 │
        │ Output:         │
        │ • 8-section     │
        │   structured    │
        │   JSON          │
        └─────────────────┘
                 │
                 ↓
        ┌─────────────────┐
        │ formatMarkdown()│
        │                 │
        │ Generate:       │
        │ • Pretty MD     │
        │ • With emojis   │
        │ • Sectioned     │
        └─────────────────┘
                 │
                 ↓
        ┌─────────────────┐
        │ Brief Saved     │
        │ (Supabase)      │
        │                 │
        │ Fields:         │
        │ • brief_data    │
        │ • markdown      │
        │ • status        │
        │ • files used    │
        │ • conversation  │
        └─────────────────┘
                 │
                 ↓
        USER SEES & EDITS BRIEF
                 │
                 ↓
        DOWNLOAD PDF or SAVE
```

---

## 4. State Machine: Brief Lifecycle

```
┌─────────────┐
│   DRAFT     │ ← User creates new brief
└──────┬──────┘   (empty or from upload)
       │
       ├─────────────────────────────┐
       │                             │
    [Edit]                      [Delete]
       │                             │
       ↓                             ↓
┌─────────────┐                   DELETED
│ IN_PROGRESS │ ← User filling out via stages
└──────┬──────┘
       │
       ├─────────────────────────────┐
       │                             │
    [AI Generate]               [Delete Draft]
       │                             │
       ↓                             ↓
┌─────────────┐                   DELETED
│  IN_REVIEW  │ ← AI created brief, user reviews
└──────┬──────┘
       │
       ├─────────────────────────────────┐
       │                                 │
    [Approve]                      [Regenerate]
       │                                 │
       ↓                                 └──→ IN_PROGRESS
┌─────────────┐
│ APPROVED ✅ │ ← Final brief, can download
└──────┬──────┘
       │
       ├─────────────────────────────┐
       │                             │
    [Download]                  [Archive]
       │                             │
       ↓                             ↓
   EXPORTED                      ARCHIVED
```

---

## 5. Tab Navigation Structure

```
CABINET
│
├─ Dashboard 📊
│  ├─ Quick Stats (3 cards)
│  ├─ Active Briefs (In Progress)
│  ├─ Recent Actions Log
│  └─ [Create New Brief] CTA
│
├─ Briefs 📋
│  ├─ Filter Bar (All|Draft|In Review|Complete)
│  ├─ Search Box
│  ├─ Brief Cards
│  │  ├─ Name, Status, Progress %
│  │  └─ Actions: View|Edit|Download|Delete
│  └─ [+ New Brief] Button
│
├─ Conversations 💬
│  ├─ Past Chat List
│  │  ├─ Conversation title
│  │  ├─ Message count
│  │  ├─ AI Agent type
│  │  └─ Brief status
│  ├─ Actions per chat:
│  │  ├─ View Chat
│  │  ├─ Generate Brief (if not exists)
│  │  ├─ Regenerate Brief (if exists)
│  │  └─ Delete
│  └─ [Continue Conversation] Button
│
├─ Files 📁
│  ├─ Upload Area (Drag-drop)
│  │  ├─ Accepted formats
│  │  └─ Max size limit
│  ├─ Files List
│  │  ├─ File name, size, type
│  │  ├─ Created date
│  │  ├─ Used in: [list of briefs]
│  │  └─ Actions: Download|Delete
│  └─ Storage usage bar (X MB used)
│
└─ Settings ⚙️
   ├─ Account Section
   │  ├─ Email, Name, Plan
   │  ├─ Joined date
   │  └─ Edit/Change buttons
   ├─ API Configuration
   │  ├─ API Key display
   │  ├─ [Regenerate] [Copy]
   │  └─ Docs link
   └─ Preferences Checkboxes
      ├─ Email updates
      ├─ Tips/tutorials
      └─ Auto-archive
```

---

## 6. 5-Stage Brief Creation Flow (Component Tree)

```
┌─────────────────────────────────────┐
│  BriefCreationFlow.vue              │
│  (Main Wizard Component)            │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
    [Progress Bar]    [Stage Content]
    [25%▁▁▁▁▁▁▁]     ├─ Stage 1: Files?
                      ├─ Stage 2: Chat?
                      ├─ Stage 3: Generate?
                      ├─ Stage 4: Review?
                      └─ Stage 5: Save?
               │
        ┌──────┴──────────────┐
        │                     │
    ┌─────────────┐  ┌──────────────┐
    │ Prev Button │  │ Next Button  │
    │ (disabled)  │  │ (Next/Submit)│
    └─────────────┘  └──────────────┘

STAGE 1: StageUploadFiles.vue
├─ File Drop Zone
├─ File Preview
├─ Remove File
└─ [Next] Button

STAGE 2: StageConversation.vue
├─ Chat Message Container
├─ AI Message + User Message
├─ Input Box
├─ Send Button
└─ [Generate Brief] Button (when ready)

STAGE 3: StageGenerate.vue
├─ Loading Animation
├─ Progress Message
├─ ("Analyzing files...")
├─ ("Synthesizing sections...")
└─ ("Almost ready...")

STAGE 4: StageReviewEdit.vue
├─ 8 Brief Sections (collapsible)
│  ├─ 🏢 Company Introduction
│  ├─ ✅ Scope & Acceptance
│  ├─ 🎯 Goals & Objectives
│  ├─ 👥 Competitors
│  ├─ 🎨 Target Audience
│  ├─ 📄 What's Been Done
│  ├─ ⏳ Timeline & Budget
│  └─ 👣 Next Steps
├─ Edit Button per section
├─ Regenerate Button
└─ [Approve] Button

STAGE 5: StageSaveExport.vue
├─ Success Message
├─ Brief Summary
├─ Download Options
│  ├─ [Download as PDF]
│  ├─ [Download as Markdown]
│  └─ [Copy Link]
└─ [View in Cabinet] Button
```

---

## 7. Brief Card Component (Briefs Tab)

```
┌─────────────────────────────────────────────────┐
│  📱 Real Estate Platform                 ▼ Menu │
├─────────────────────────────────────────────────┤
│                                                 │
│  Status: ✅ COMPLETE                            │
│  Created: May 3, 2026 | Updated: May 10        │
│                                                 │
│  🏢 Company        | ✅ Scope                   │
│  🎯 Goals          | 👥 Audience               │
│  📄 Done           | ⏳ Timeline                │
│  👣 Next Steps     |                            │
│                                                 │
│  Files Used: 3 (BrandGuide, Wireframes, Logo) │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Preview:                                 │  │
│  │ "Real Estate Platform aims to provide..." │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  [View Full] [Edit] [Download PDF] [Delete]    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 8. API Request/Response Flow

```
Frontend                        Backend                    Supabase
─────────────────────────────────────────────────────────────────

[User clicks "Create"]
         │
         ├─→ POST /api/briefs/create
         │   {
         │     project_name: "...",
         │     mode: "upload_files"
         │   }
         │
         │   ← Brief ID created (draft)
         ├─→ GET /api/briefs/:id
         │
         │   ← Empty draft brief struct
         │
[User uploads files]
         │
         ├─→ POST /api/files/upload
         │   (multipart form)
         │
         │   ← File path in storage ─────→ Supabase Storage
         │
[User starts chat]
         │
         ├─→ POST /api/chat/guided-briefing
         │   {
         │     brief_id: "...",
         │     user_message: "..."
         │   }
         │
         │   ← AI Response
         │   ← Extracted BriefData ───────→ Update Brief record
         │
[AI generates brief]
         │
         ├─→ POST /api/briefs/:id/generate
         │   { userEmail, file_ids }
         │
         │   ← Call AI SDK (Gemini)
         │   ← Return generated JSON
         │   ← Call formatMarkdown()
         │   ← Save to DB ───────────────→ Supabase briefs table
         │
[User downloads]
         │
         ├─→ GET /api/briefs/:id/export?format=pdf
         │   ← Generate PDF ─────────────→ Return binary
         │
         ←──────────────────────────────────
         PDF downloaded
```

---

## 9. Component Hierarchy (Full Tree)

```
pages/cabinet.vue
├─ HeaderSection (global)
├─ ParticleEffect (global)
├─ GlowBlue (global)
│
├─ components/cabinet/CabinetTabs.vue
│  ├─ Tab Nav Bar
│  │  ├─ Dashboard Tab
│  │  ├─ Briefs Tab
│  │  ├─ Conversations Tab
│  │  ├─ Files Tab
│  │  └─ Settings Tab
│  │
│  ├─ components/cabinet/DashboardView.vue
│  │  ├─ WelcomeBox
│  │  ├─ StatsCards (3x)
│  │  ├─ ActiveBriefsList
│  │  └─ RecentActions
│  │
│  ├─ components/cabinet/BriefsView.vue
│  │  ├─ FilterBar
│  │  ├─ SearchBox
│  │  ├─ BriefCard (repeating)
│  │  │  ├─ BriefPreviewModal
│  │  │  └─ BriefMenuOptions
│  │  └─ CreateNewBriefButton
│  │
│  ├─ components/cabinet/ConversationsView.vue
│  │  ├─ ConversationCard (repeating)
│  │  │  ├─ ChatPreview
│  │  │  └─ ActionButtons
│  │  └─ LinkBriefToChatButton
│  │
│  ├─ components/cabinet/FilesView.vue
│  │  ├─ FileUploadZone
│  │  ├─ FileList
│  │  │  ├─ FileItem (repeating)
│  │  │  └─ FileActions
│  │  └─ StorageUsageBar
│  │
│  └─ components/cabinet/SettingsView.vue
│     ├─ AccountSettings
│     ├─ APIConfig
│     └─ Preferences
│
└─ components/modals/
   ├─ components/cabinet/BriefCreationFlow.vue (modal)
   │  ├─ ProgressBar
   │  ├─ components/cabinet/StageUploadFiles.vue
   │  │  ├─ DropZone
   │  │  └─ FilePreview
   │  │
   │  ├─ components/cabinet/StageConversation.vue
   │  │  ├─ ChatContainer
   │  │  ├─ MessageItem
   │  │  └─ InputBox
   │  │
   │  ├─ components/cabinet/StageGenerate.vue
   │  │  ├─ LoadingAnimation
   │  │  └─ ProgressMessages
   │  │
   │  ├─ components/cabinet/StageReviewEdit.vue
   │  │  ├─ BriefSectionCard (8x)
   │  │  ├─ EditModal
   │  │  └─ ActionBar
   │  │
   │  ├─ components/cabinet/StageSaveExport.vue
   │  │  ├─ SuccessMessage
   │  │  ├─ BriefSummary
   │  │  └─ ExportButtons
   │  │
   │  └─ NavigationButtons (Prev/Next)
   │
   └─ components/modals/BriefPreviewModal.vue
      ├─ FullBriefDisplay
      └─ ExportOptions

FooterSection (global)
```

---

## 10. State Management (Pinia/Composable)

```
useBriefStore {
  state: {
    briefs: Brief[]
    currentBrief: Brief | null
    creatingBrief: BriefDraft
    isLoading: boolean
    error: string | null
  }
  
  actions: {
    createBrief(mode: string)
    loadBrief(id: string)
    updateBriefData(data: Partial<Brief>)
    generateBrief(id: string)
    deleteBrief(id: string)
    exportBrief(id: string, format: 'pdf' | 'md')
    
    // Stage flow
    setCurrentStage(stage: 1|2|3|4|5)
    uploadFiles(files: File[])
    sendChatMessage(message: string)
    
    // Fetching
    fetchBriefs()
    fetchConversations()
  }
  
  getters: {
    activeBriefs
    completedBriefs
    draftBriefs
    briefProgress
    fileCount
  }
}

useFilesStore {
  state: {
    userFiles: UploadedFile[]
    selectedFiles: string[]
  }
  
  actions: {
    uploadFile(file: File)
    deleteFile(id: string)
    linkFileToBrief(briefId: string, fileIds: string[])
  }
}

useChatStore {
  state: {
    currentConversation: Message[]
    extractedData: BriefData
  }
  
  actions: {
    sendMessage(msg: string)
    extractBriefData()
    continuePastConversation(conversationId: string)
  }
}
```

---

## 11. Database Schema (Supabase SQL)

```sql
-- Existing: messages, conversations tables

-- New: briefs table
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR NOT NULL,
  project_name VARCHAR NOT NULL,
  
  -- Content
  brief_data JSONB NOT NULL,
  markdown_content TEXT NOT NULL,
  
  -- Status
  status VARCHAR CHECK (status IN ('draft', 'in_progress', 'in_review', 'approved', 'archived')),
  stage INTEGER CHECK (stage BETWEEN 1 AND 5),
  
  -- Relations
  conversation_id UUID REFERENCES conversations(id),
  file_ids TEXT[] DEFAULT '{}',
  
  -- Metadata
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indices
  FOREIGN KEY (user_email) REFERENCES users(email)
);

CREATE INDEX idx_briefs_user ON briefs(user_email);
CREATE INDEX idx_briefs_status ON briefs(status);
CREATE INDEX idx_briefs_conversation ON briefs(conversation_id);

-- New: brief_versions table (for history)
CREATE TABLE brief_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  brief_data JSONB,
  markdown_content TEXT,
  version INTEGER,
  changed_by VARCHAR,
  change_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- New: brief_files table (relation table)
CREATE TABLE brief_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  file_path VARCHAR NOT NULL,
  analyzed_at TIMESTAMP,
  extracted_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 12. Timeline & Milestones

```
WEEK 1: Design & Planning
├─ Finalize designs in Figma
├─ Create component specs
└─ Plan sprint tasks

WEEK 2-3: Component Development
├─ CabinetTabs (navigation)
├─ DashboardView
├─ BriefsView
├─ FilesView
└─ SettingsView

WEEK 3-4: Brief Creation Flow
├─ BriefCreationFlow (main)
├─ All 5 stage components
├─ Progress bar
└─ API integration

WEEK 4-5: Integration & Testing
├─ Connect to API endpoints
├─ Test file upload flow
├─ Test AI brief generation
├─ E2E user journey testing
└─ QA & bug fixes

WEEK 5-6: Deployment
├─ Stage to dev environment
├─ User testing (5-7 people)
├─ Feedback iteration
├─ Production deployment
└─ Monitor & support
```
