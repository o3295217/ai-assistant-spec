#!/bin/bash

# Update and Restart Docker - Personal AI Effectiveness Assistant
# Двойной клик на этот файл обновит приложение и перезапустит Docker

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

clear

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        Обновление и перезапуск приложения                 ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📂 Директория проекта:${NC} $SCRIPT_DIR"
echo ""

# Step 1: Git pull
echo -e "${BLUE}📥 Шаг 1/3: Получаю обновления с GitHub...${NC}"
echo ""

git fetch origin
git pull origin claude/read-project-file-011CUxhFPATd3uJNSpJNTcGw

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Обновления получены${NC}"
else
    echo ""
    echo -e "${RED}✗ Ошибка при получении обновлений${NC}"
    echo ""
    read -n 1 -s -r -p "Нажмите любую клавишу для выхода..."
    exit 1
fi

echo ""
echo -e "${BLUE}🔨 Шаг 2/3: Пересборка Docker образа...${NC}"
echo ""

# Stop container
docker-compose down

# Rebuild and start
docker-compose build --no-cache
docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Docker контейнер перезапущен${NC}"
else
    echo ""
    echo -e "${RED}✗ Ошибка при запуске Docker${NC}"
    echo ""
    read -n 1 -s -r -p "Нажмите любую клавишу для выхода..."
    exit 1
fi

echo ""
echo -e "${BLUE}⏳ Шаг 3/3: Ожидание запуска приложения...${NC}"
sleep 5

# Check if container is running
if [ "$(docker ps -q -f name=ai-assistant-app)" ]; then
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          ✓ Приложение успешно обновлено!                 ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}🌐 Приложение доступно по адресу:${NC}"
    echo -e "${GREEN}   → http://localhost:3000${NC}"
    echo ""

    # Show last commit
    echo -e "${YELLOW}📋 Последние изменения:${NC}"
    git log -1 --pretty=format:"%h - %s (%ar)" --abbrev-commit
    echo ""
    echo ""

    # Ask to open browser
    echo -e "${YELLOW}Открыть в браузере? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^[YyДд]$ ]]; then
        open http://localhost:3000
        echo -e "${GREEN}✓ Браузер открыт${NC}"
    fi
else
    echo ""
    echo -e "${RED}✗ Контейнер не запустился${NC}"
    echo -e "${YELLOW}Проверьте логи: docker-compose logs${NC}"
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""
read -n 1 -s -r -p "Нажмите любую клавишу для выхода..."
