#!/bin/bash

# Docker-UP001: Полное обновление Docker образа
# Использование: ./Docker-UP001.sh

# Переход в директорию скрипта
cd "$(dirname "$0")"

set -e  # Остановка при ошибке

echo "🛑 Останавливаю Docker контейнер..."
docker-compose down

echo ""
echo "🧹 Очистка старых образов (опционально)..."
docker image prune -f

echo ""
echo "🔨 Пересборка Docker образа с обновлениями..."
docker-compose build --no-cache

echo ""
echo "🚀 Запуск Docker контейнера..."
docker-compose up -d

echo ""
echo "⏳ Ожидание запуска сервера (5 секунд)..."
sleep 5

echo ""
echo "📋 Логи запуска:"
docker logs ai-assistant-app --tail 20

echo ""
echo "✅ Готово! Сервер доступен на http://localhost:3000"
echo ""
echo "Проверка версии:"
docker exec ai-assistant-app cat /app/.next/BUILD_ID 2>/dev/null || echo "BUILD_ID не найден"

echo ""
echo "Команды для мониторинга:"
echo "  docker logs -f ai-assistant-app          # Логи в реальном времени"
echo "  docker exec ai-assistant-app <команда>   # Выполнить команду в контейнере"
echo "  docker-compose down                       # Остановить контейнер"
