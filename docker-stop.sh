#!/bin/bash

# Docker Stop Script for Personal AI Effectiveness Assistant
# This script stops and removes the Docker container

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Personal AI Effectiveness Assistant - Docker Stop      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if container is running
if [ "$(docker ps -q -f name=ai-assistant-app)" ]; then
    echo -e "${YELLOW}⏹️  Останавливаю контейнер...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Контейнер остановлен${NC}"
else
    echo -e "${YELLOW}⚠️  Контейнер не запущен${NC}"
fi

# Check if container exists (stopped)
if [ "$(docker ps -aq -f name=ai-assistant-app)" ]; then
    echo -e "${YELLOW}🗑️  Удаляю остановленный контейнер...${NC}"
    docker rm ai-assistant-app 2>/dev/null || true
    echo -e "${GREEN}✓ Контейнер удален${NC}"
fi

echo ""
echo -e "${GREEN}✓ Готово!${NC}"
echo -e "${YELLOW}Для запуска снова используйте: ./docker-start.sh${NC}"
