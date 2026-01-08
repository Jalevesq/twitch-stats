#!/bin/bash

set -e

cd "$(dirname "$0")/../docker-compose"

echo "📦 Pulling latest code..."
git pull

echo "🐳 Pulling latest images..."
docker compose -f docker-compose.prd.yml pull

echo "🚀 Starting app..."
docker compose -f docker-compose.prd.yml up -d

docker compose -f docker-compose.prd.yml restart nginx

echo "✅ Deployed!"