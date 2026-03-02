-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('briefing', 'presale')),
  workflow_id UUID,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table (for agent context)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('briefing', 'presale')),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workflows table
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('briefing', 'presale')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  steps_json JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_conversations_user_email ON conversations(user_email);
CREATE INDEX idx_conversations_agent_type ON conversations(agent_type);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_documents_agent_type ON documents(agent_type);
CREATE INDEX idx_workflows_agent_type ON workflows(agent_type);
