#!/bin/bash

# VoltOps Integration Setup Script
# This script helps set up VoltOps Console integration for SiteSynth

set -e

echo "🚀 SiteSynth VoltOps Integration Setup"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Creating..."
    touch .env.local
fi

# Ask for VoltOps API key
echo "To enable VoltOps observability:"
echo "1. Visit: https://console.voltagent.dev"
echo "2. Create a project called 'SiteSynth'"
echo "3. Copy your API key"
echo ""
read -p "Enter your VOLTAGENT_API_KEY (or press Enter to skip): " api_key

if [ -n "$api_key" ]; then
    # Check if key already exists in .env.local
    if grep -q "VOLTAGENT_API_KEY" .env.local; then
        sed -i '' "s/VOLTAGENT_API_KEY=.*/VOLTAGENT_API_KEY=$api_key/" .env.local
        echo "✅ Updated VOLTAGENT_API_KEY in .env.local"
    else
        echo "VOLTAGENT_API_KEY=$api_key" >> .env.local
        echo "✅ Added VOLTAGENT_API_KEY to .env.local"
    fi
else
    echo "⚠️  VOLTAGENT_API_KEY not set. Logging will work locally but won't sync to VoltOps."
fi

# Set project ID
echo ""
read -p "Enter your VOLTAGENT_PROJECT_ID (default: sitesynth): " project_id
project_id=${project_id:-sitesynth}

if grep -q "VOLTAGENT_PROJECT_ID" .env.local; then
    sed -i '' "s/VOLTAGENT_PROJECT_ID=.*/VOLTAGENT_PROJECT_ID=$project_id/" .env.local
else
    echo "VOLTAGENT_PROJECT_ID=$project_id" >> .env.local
fi
echo "✅ Set VOLTAGENT_PROJECT_ID=$project_id"

# Set log level
echo ""
read -p "Set LOG_LEVEL (debug/info, default: info): " log_level
log_level=${log_level:-info}

if grep -q "LOG_LEVEL" .env.local; then
    sed -i '' "s/LOG_LEVEL=.*/LOG_LEVEL=$log_level/" .env.local
else
    echo "LOG_LEVEL=$log_level" >> .env.local
fi
echo "✅ Set LOG_LEVEL=$log_level"

echo ""
echo "======================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Once server starts, check console for:"
echo "   'VoltOps telemetry enabled' ✅"
echo ""
echo "3. Open VoltOps Console:"
echo "   https://console.voltagent.dev"
echo ""
echo "4. Start using Cabinet to see agents in action!"
echo ""
echo "📖 For more info: see VOLTAGENT_SETUP.md"
