# 🚀 Быстрый деплой на Vercel

## ⚠️ ВАЖНО: SQLite не работает на Vercel!

Vercel использует serverless функции, которые не поддерживают SQLite файлы.
**Нужна облачная БД:** PostgreSQL, MySQL или Turso.

---

## 📋 Пошаговая инструкция

### Шаг 1: Создать Postgres БД на Vercel

1. Зайти на https://vercel.com/dashboard
2. **Storage** → **Create Database** → **Postgres**
3. Выбрать регион (ближе к вам)
4. Создать БД (бесплатно до 256MB)
5. Скопировать `DATABASE_URL` (Postgres connection string)

Пример URL:
```
postgresql://default:***@ep-***-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb
```

---

### Шаг 2: Переключить проект на Postgres

```bash
# Запустить скрипт
./switch-to-postgres.sh

# ИЛИ вручную:
# 1. Обновить prisma/schema.prisma
#    provider = "postgresql"  # было: sqlite
#
# 2. Удалить старые миграции
#    rm -rf prisma/migrations
#
# 3. Установить DATABASE_URL
#    export DATABASE_URL='postgresql://...'
#
# 4. Создать миграцию для Postgres
#    npx prisma migrate dev --name init_postgres
```

---

### Шаг 3: Заполнить начальные данные

```bash
# Вставить 14 evaluation criteria
npm run seed

# ИЛИ
npx prisma db seed
```

---

### Шаг 4: Задеплоить на Vercel

#### Вариант A: Через Web UI

1. Зайти на https://vercel.com/new
2. Import Git Repository → выбрать `ai-assistant-spec`
3. **Environment Variables**:
   ```
   DATABASE_URL = postgresql://default:***@...
   ANTHROPIC_API_KEY = sk-ant-***
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   ```
4. **Deploy** → готово!

#### Вариант B: Через CLI

```bash
# Установить Vercel CLI
npm i -g vercel

# Залогиниться
vercel login

# Первый деплой
vercel

# Добавить переменные окружения
vercel env add DATABASE_URL
vercel env add ANTHROPIC_API_KEY

# Production деплой
vercel --prod
```

---

### Шаг 5: После деплоя - Seed БД

```bash
# Применить миграции и seed через Vercel CLI
vercel env pull .env.production
npx prisma db seed
```

**ИЛИ** через SQL в Vercel Dashboard:

1. Storage → ваша БД → Query
2. Вставить SQL из `prisma/migrations/.../migration.sql`
3. Выполнить seed вручную

---

## 🔧 Важные настройки

### package.json - уже настроен ✅

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "postinstall": "prisma generate"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

### .env для локальной разработки

```bash
# Локально - SQLite
DATABASE_URL="file:./dev.db"

# Для тестов с Postgres локально
# DATABASE_URL="postgresql://localhost:5432/mydb"
```

### Environment Variables на Vercel

```
DATABASE_URL = postgresql://...  (из Vercel Postgres)
ANTHROPIC_API_KEY = sk-ant-...   (ваш ключ)
NEXT_PUBLIC_APP_URL = https://...vercel.app
```

---

## ✅ Проверка деплоя

После успешного деплоя:

1. **Откройте приложение** - https://your-app.vercel.app
2. **Проверьте логи** - Vercel Dashboard → Deployments → Logs
3. **Проверьте БД** - Vercel Dashboard → Storage → Query
   ```sql
   SELECT COUNT(*) FROM evaluation_criteria;
   -- Должно вернуть: 14
   ```

---

## 🆘 Решение проблем

### Ошибка: "Table not found"
```bash
# Применить миграции
npx prisma migrate deploy
npx prisma db seed
```

### Ошибка: "Cannot find module '@prisma/client'"
```bash
# Пересобрать
vercel --force
```

### Ошибка: SQLite ошибки на Vercel
- Убедитесь что в `schema.prisma`: `provider = "postgresql"`
- Проверьте DATABASE_URL в Environment Variables

### База пустая после деплоя
```bash
# Запустить seed
npx prisma db seed
```

---

## 🎯 Автоматический деплой

После настройки:
- Push в `main` → автоматический production деплой
- Push в другие ветки → preview деплой
- Pull Request → автоматический preview

---

## 💡 Альтернативы Vercel Postgres

### Turso (SQLite в облаке, бесплатно)
```bash
npm install @libsql/client
# https://turso.tech
```

### Supabase (PostgreSQL, бесплатно)
```bash
# https://supabase.com
# Получить DATABASE_URL из проекта
```

### PlanetScale (MySQL, бесплатно)
```bash
# https://planetscale.com
# provider = "mysql"
```

---

## 📊 Мониторинг

Vercel Dashboard:
- **Logs** - реальном времени
- **Analytics** - посещаемость
- **Speed Insights** - производительность
- **Error tracking** - автоматический

---

✅ **Готово к деплою!**
