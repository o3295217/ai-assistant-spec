#!/bin/bash

# Скрипт для переключения на PostgreSQL для деплоя на Vercel

echo "🔄 Переход на PostgreSQL для Vercel..."
echo ""

# 1. Обновляем schema.prisma
echo "📝 Обновляем prisma/schema.prisma..."
sed -i.bak 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# 2. Удаляем старые миграции SQLite
echo "🗑️  Удаляем старые SQLite миграции..."
rm -rf prisma/migrations

# 3. Создаем новую миграцию для Postgres
echo "🆕 Создаем миграцию для PostgreSQL..."
echo ""
echo "⚠️  ВАЖНО: Убедитесь что у вас есть DATABASE_URL для Postgres!"
echo ""
echo "Пример: DATABASE_URL='postgresql://user:password@host/database'"
echo ""
read -p "DATABASE_URL установлена? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Установите DATABASE_URL и запустите снова"
    exit 1
fi

npx prisma migrate dev --name init_postgres

echo ""
echo "✅ Готово!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Добавить DATABASE_URL в Vercel Environment Variables"
echo "2. git add . && git commit -m 'Switch to PostgreSQL'"
echo "3. git push"
echo ""
