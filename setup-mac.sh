#!/bin/bash

# 🔧 Personal AI Effectiveness Assistant - Full Setup Script for macOS
# Полная установка и настройка приложения с нуля

set -e

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Personal AI Effectiveness Assistant - Setup       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Проверка Homebrew (опционально)
if command -v brew &> /dev/null; then
    echo -e "${GREEN}✓${NC} Homebrew установлен"
else
    echo -e "${YELLOW}⚠️  Homebrew не установлен${NC}"
    echo "Homebrew упрощает установку зависимостей на Mac."
    echo "Установить Homebrew? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Установка Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
fi
echo ""

# Проверка Node.js
echo -e "${YELLOW}Проверка Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не установлен${NC}"

    if command -v brew &> /dev/null; then
        echo "Установить Node.js через Homebrew? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            brew install node
        else
            echo "Установите Node.js вручную с https://nodejs.org/"
            exit 1
        fi
    else
        echo "Установите Node.js с https://nodejs.org/ (рекомендуется v18 или выше)"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Node.js уже установлен: $(node -v)"
fi
echo ""

# Установка зависимостей проекта
echo -e "${YELLOW}Установка зависимостей проекта...${NC}"
npm install
echo -e "${GREEN}✓${NC} Зависимости установлены"
echo ""

# Создание .env.local
echo -e "${YELLOW}Настройка конфигурации...${NC}"
if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
# Database
DATABASE_URL="file:./prisma/dev.db"

# Anthropic API
# ВАЖНО: Замените на ваш реальный API ключ от Anthropic
# Получите ключ на https://console.anthropic.com/
ANTHROPIC_API_KEY="sk-ant-your-api-key-here"
EOF
    echo -e "${GREEN}✓${NC} Создан файл .env.local"
    echo ""
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║                 ⚠️  ВАЖНОЕ НАПОМИНАНИЕ                 ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "1. Зарегистрируйтесь на https://console.anthropic.com/"
    echo "2. Создайте API ключ"
    echo "3. Откройте файл .env.local"
    echo "4. Замените 'sk-ant-your-api-key-here' на ваш настоящий ключ"
    echo ""
    echo "Открыть .env.local сейчас? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        if command -v code &> /dev/null; then
            code .env.local
        elif command -v nano &> /dev/null; then
            nano .env.local
        else
            open -e .env.local
        fi
    fi
else
    echo -e "${GREEN}✓${NC} Файл .env.local уже существует"
fi
echo ""

# Создание базы данных
echo -e "${YELLOW}Создание базы данных...${NC}"
if [ -f "setup-db.js" ]; then
    node setup-db.js
    echo -e "${GREEN}✓${NC} База данных создана успешно"
else
    echo -e "${RED}❌ setup-db.js не найден${NC}"
fi
echo ""

# Создание директории для логов
mkdir -p logs
echo -e "${GREEN}✓${NC} Директория логов создана"
echo ""

# Завершение
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ Установка завершена успешно!           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📋 Следующие шаги:${NC}"
echo ""
echo -e "1. ${YELLOW}Настройте API ключ Anthropic в .env.local${NC}"
echo -e "   Откройте файл: ${GREEN}open .env.local${NC}"
echo ""
echo -e "2. ${YELLOW}Запустите приложение:${NC}"
echo -e "   ${GREEN}./start.sh${NC}"
echo -e "   или"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo -e "3. ${YELLOW}Откройте в браузере:${NC}"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}📚 Документация:${NC}"
echo -e "   README.md     - Полное руководство"
echo -e "   LOGGING.md    - Система логирования"
echo ""
echo -e "${GREEN}Готово! 🎉${NC}"
echo ""
