#!/bin/bash

# Local Deployment Script for ai-assistant-spec
# Синхронизирует изменения с GitHub и запускает Docker на вашем Mac

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

LOCAL_PATH="/Users/oleggluskov/Documents/GooglDisk/ai-assistant-spec"
BRANCH="claude/read-project-file-011CUxhFPATd3uJNSpJNTcGw"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Deployment to Local Mac with Docker                    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running on Mac
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ Этот скрипт предназначен для macOS${NC}"
    echo -e "${YELLOW}Текущая ОС: $OSTYPE${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен!${NC}"
    echo -e "${YELLOW}Установите Docker Desktop: https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker не запущен!${NC}"
    echo -e "${YELLOW}Запустите Docker Desktop и попробуйте снова${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker установлен и запущен${NC}"

# Check if local directory exists
if [ ! -d "$LOCAL_PATH" ]; then
    echo -e "${YELLOW}⚠️  Директория $LOCAL_PATH не найдена${NC}"
    echo -e "${BLUE}📂 Клонирую проект...${NC}"

    # Create parent directory
    mkdir -p "$(dirname "$LOCAL_PATH")"

    # Clone repository
    git clone https://github.com/o3295217/ai-assistant-spec.git "$LOCAL_PATH"
    cd "$LOCAL_PATH"
    git checkout "$BRANCH"

    echo -e "${GREEN}✓ Проект склонирован${NC}"
else
    echo -e "${GREEN}✓ Директория найдена: $LOCAL_PATH${NC}"
    cd "$LOCAL_PATH"

    # Pull latest changes
    echo -e "${BLUE}📥 Получаю последние изменения с GitHub...${NC}"
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"

    echo -e "${GREEN}✓ Изменения получены${NC}"
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  Создаю .env.local...${NC}"
    cat > .env.local << EOF
DATABASE_URL="file:./prisma/dev.db"
ANTHROPIC_API_KEY="sk-ant-your-api-key-here"
EOF
    echo -e "${RED}⚠️  ВАЖНО: Добавьте ваш Anthropic API ключ в .env.local${NC}"
    echo -e "${YELLOW}Откройте файл: nano $LOCAL_PATH/.env.local${NC}"
    echo ""
    read -p "Нажмите Enter после того, как добавите API ключ..."
fi

# Create necessary directories
mkdir -p prisma logs

# Check if database exists
if [ ! -f prisma/dev.db ]; then
    echo -e "${YELLOW}⚠️  База данных не найдена. Создаю...${NC}"

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js не установлен!${NC}"
        echo -e "${YELLOW}Установите Node.js: https://nodejs.org/${NC}"
        exit 1
    fi

    # Install better-sqlite3 temporarily
    npm install better-sqlite3 --no-save

    # Create database
    node setup-db.js

    echo -e "${GREEN}✓ База данных создана${NC}"
else
    echo -e "${GREEN}✓ База данных найдена${NC}"
fi

# Stop existing container if running
if [ "$(docker ps -q -f name=ai-assistant-app)" ]; then
    echo -e "${YELLOW}⏹️  Останавливаю существующий контейнер...${NC}"
    docker-compose down
fi

# Build and start Docker container
echo -e "${BLUE}🔨 Собираю Docker образ...${NC}"
docker-compose build

echo -e "${BLUE}🚀 Запускаю контейнер...${NC}"
docker-compose up -d

# Wait for container to start
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
    echo -e "${YELLOW}📂 Путь к проекту:${NC}"
    echo -e "${BLUE}   $LOCAL_PATH${NC}"
    echo ""
    echo -e "${YELLOW}📋 Полезные команды:${NC}"
    echo -e "   ${BLUE}cd $LOCAL_PATH${NC}"
    echo -e "   ${BLUE}docker-compose logs -f${NC}     - Просмотр логов"
    echo -e "   ${BLUE}docker-compose stop${NC}        - Остановить контейнер"
    echo -e "   ${BLUE}docker-compose restart${NC}     - Перезапустить контейнер"
    echo -e "   ${BLUE}./docker-stop.sh${NC}           - Остановить и удалить контейнер"
    echo ""

    # Open in browser
    echo -e "${YELLOW}Открыть в браузере? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        open http://localhost:3000
    fi
else
    echo -e "${RED}❌ Не удалось запустить контейнер${NC}"
    echo -e "${YELLOW}Проверьте логи: docker-compose logs${NC}"
    exit 1
fi
