#!/bin/bash

# Docker Start Script for Personal AI Effectiveness Assistant
# This script builds and starts the Docker container

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Personal AI Effectiveness Assistant - Docker Start     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен!${NC}"
    echo -e "${YELLOW}Установите Docker Desktop: https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker не запущен!${NC}"
    echo -e "${YELLOW}Запустите Docker Desktop${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker установлен и запущен${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  Файл .env.local не найден. Создаю...${NC}"
    cat > .env.local << EOF
DATABASE_URL="file:./prisma/dev.db"
ANTHROPIC_API_KEY="sk-ant-your-api-key-here"
EOF
    echo -e "${YELLOW}⚠️  ВАЖНО: Добавьте ваш Anthropic API ключ в .env.local${NC}"
fi

# Create necessary directories
mkdir -p prisma logs

# Check if database exists
if [ ! -f prisma/dev.db ]; then
    echo -e "${YELLOW}⚠️  База данных не найдена. Создаю...${NC}"
    if [ -f setup-db.js ]; then
        npm install better-sqlite3 --no-save 2>/dev/null || true
        node setup-db.js
        echo -e "${GREEN}✓ База данных создана${NC}"
    else
        echo -e "${RED}❌ Файл setup-db.js не найден${NC}"
        exit 1
    fi
fi

# Stop existing container if running
if [ "$(docker ps -q -f name=ai-assistant-app)" ]; then
    echo -e "${YELLOW}⏹️  Останавливаю существующий контейнер...${NC}"
    docker-compose down
fi

# Build and start container
echo -e "${BLUE}🔨 Собираю Docker образ...${NC}"
docker-compose build

echo -e "${BLUE}🚀 Запускаю контейнер...${NC}"
docker-compose up -d

# Wait for container to be healthy
echo -e "${BLUE}⏳ Ожидаю запуска приложения...${NC}"
sleep 5

# Check if container is running
if [ "$(docker ps -q -f name=ai-assistant-app)" ]; then
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          ✓ Приложение успешно запущено!                  ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}🌐 Приложение доступно по адресу:${NC}"
    echo -e "${BLUE}   → http://localhost:3000${NC}"
    echo ""
    echo -e "${YELLOW}📋 Полезные команды:${NC}"
    echo -e "   ${BLUE}docker-compose logs -f${NC}     - Просмотр логов"
    echo -e "   ${BLUE}docker-compose stop${NC}        - Остановить контейнер"
    echo -e "   ${BLUE}docker-compose restart${NC}     - Перезапустить контейнер"
    echo -e "   ${BLUE}./docker-stop.sh${NC}           - Остановить и удалить контейнер"
    echo ""
else
    echo -e "${RED}❌ Не удалось запустить контейнер${NC}"
    echo -e "${YELLOW}Проверьте логи: docker-compose logs${NC}"
    exit 1
fi
