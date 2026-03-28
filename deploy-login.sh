#!/bin/bash

# Deploy agents login page to Oracle server
# Usage: ./deploy-login.sh <server_ip>

SERVER=${1:-146.235.38.32}
SOURCE="public/agents-login.html"
DEST="/var/www/agents-auth/index.html"

echo "🚀 Deploying login page to $SERVER..."

# Copy file
scp "$SOURCE" "root@$SERVER:$DEST" || {
  echo "❌ SCP failed. Trying alternative method..."
  # Alternative: use cat and pipe through ssh
  cat "$SOURCE" | ssh "root@$SERVER" "cat > $DEST && chmod 644 $DEST && systemctl reload nginx && echo '✓ Deployed'" && exit 0
}

# Set permissions and reload nginx
ssh "root@$SERVER" "chmod 644 $DEST && systemctl reload nginx && echo '✓ Login page deployed, nginx reloaded'"

echo "✅ Done! Check https://agents.sitesynth.com"
