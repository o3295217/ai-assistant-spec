#!/bin/bash

# 🚀 Personal AI Effectiveness Assistant - Quick Start Script for macOS
# Этот скрипт автоматически настраивает и запускает приложение

set -e  # Остановка при ошибке

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Personal AI Effectiveness Assistant - Quick Start   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Проверка Node.js
echo -e "${YELLOW}[1/6]${NC} Проверка Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не установлен!${NC}"
    echo -e "Установите Node.js с https://nodejs.org/ (рекомендуется v18 или выше)"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js установлен: $NODE_VERSION"
echo ""

# 2. Проверка npm
echo -e "${YELLOW}[2/6]${NC} Проверка npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm не установлен!${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓${NC} npm установлен: v$NPM_VERSION"
echo ""

# 3. Установка зависимостей
echo -e "${YELLOW}[3/6]${NC} Проверка зависимостей..."
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей (это может занять несколько минут)..."
    npm install
    echo -e "${GREEN}✓${NC} Зависимости установлены"
else
    echo -e "${GREEN}✓${NC} Зависимости уже установлены"
fi
echo ""

# 4. Создание базы данных
echo -e "${YELLOW}[4/6]${NC} Проверка базы данных..."
if [ ! -f "prisma/dev.db" ]; then
    echo "🗄️  Создание базы данных SQLite..."
    if [ -f "setup-db.js" ]; then
        node setup-db.js
        echo -e "${GREEN}✓${NC} База данных создана"
    else
        echo -e "${RED}❌ Файл setup-db.js не найден!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} База данных уже существует"
fi
echo ""

# 5. Проверка .env.local
echo -e "${YELLOW}[5/6]${NC} Проверка конфигурации..."
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ Файл .env.local не найден!${NC}"
    echo "Создание .env.local из шаблона..."
    cat > .env.local << 'EOF'
# Database
DATABASE_URL="file:./prisma/dev.db"

# Anthropic API
# ВАЖНО: Замените на ваш реальный API ключ от Anthropic
ANTHROPIC_API_KEY="sk-ant-your-api-key-here"
EOF
    echo -e "${YELLOW}⚠️  Создан файл .env.local${NC}"
    echo -e "${YELLOW}⚠️  ВАЖНО: Добавьте ваш ANTHROPIC_API_KEY в файл .env.local${NC}"
else
    echo -e "${GREEN}✓${NC} Файл .env.local найден"

    # Проверка API ключа
    if grep -q "sk-ant-your-api-key-here" .env.local; then
        echo -e "${YELLOW}⚠️  Обнаружен placeholder API ключ${NC}"
        echo -e "${YELLOW}⚠️  Для работы ИИ-оценки замените ANTHROPIC_API_KEY в .env.local${NC}"
    else
        echo -e "${GREEN}✓${NC} API ключ настроен"
    fi
fi
echo ""

# 6. Запуск сервера
echo -e "${YELLOW}[6/6]${NC} Запуск сервера разработки..."
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            🎉 Приложение готово к запуску!            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 Приложение будет доступно по адресу:${NC}"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}📚 Страницы:${NC}"
echo -e "   • Главная:     ${GREEN}http://localhost:3000${NC}"
echo -e "   • Цели:        ${GREEN}http://localhost:3000/goals${NC}"
echo -e "   • Сегодня:     ${GREEN}http://localhost:3000/daily${NC}"
echo -e "   • История:     ${GREEN}http://localhost:3000/history${NC}"
echo -e "   • Аналитика:   ${GREEN}http://localhost:3000/analytics${NC}"
echo -e "   • Отчеты:      ${GREEN}http://localhost:3000/reports${NC}"
echo -e "   • Задачи:      ${GREEN}http://localhost:3000/tasks${NC}"
echo ""
echo -e "${YELLOW}💡 Для остановки сервера нажмите Ctrl+C${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Запуск
npm run dev
