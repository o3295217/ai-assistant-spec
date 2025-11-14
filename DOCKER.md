# 🐳 Docker Deployment Guide

Полное руководство по запуску Personal AI Effectiveness Assistant в Docker контейнере.

## 📋 Содержание

1. [Требования](#требования)
2. [Быстрый старт](#быстрый-старт)
3. [Подробная инструкция](#подробная-инструкция)
4. [Управление контейнером](#управление-контейнером)
5. [Конфигурация](#конфигурация)
6. [Troubleshooting](#troubleshooting)

---

## Требования

### Обязательно:
- **Docker Desktop** 20.10+ ([Скачать](https://www.docker.com/products/docker-desktop))
- **Docker Compose** 2.0+ (обычно входит в Docker Desktop)
- **Anthropic API Key** ([Получить](https://console.anthropic.com/))

### Системные требования:
- **RAM**: минимум 2GB свободной памяти
- **Disk**: минимум 1GB свободного места
- **OS**: macOS, Linux, или Windows с WSL2

---

## Быстрый старт

### 1️⃣ Клонируйте репозиторий

```bash
git clone https://github.com/o3295217/ai-assistant-spec.git
cd ai-assistant-spec
git checkout claude/read-project-file-011CUxhFPATd3uJNSpJNTcGw
```

### 2️⃣ Настройте API ключ

Откройте файл `.env.local` и добавьте ваш Anthropic API ключ:

```bash
nano .env.local
# Или используйте любой другой редактор
```

Замените `sk-ant-your-api-key-here` на ваш настоящий ключ.

### 3️⃣ Запустите контейнер

```bash
./docker-start.sh
```

### 4️⃣ Откройте браузер

Перейдите на **http://localhost:3000** 🎉

---

## Подробная инструкция

### Шаг 1: Установка Docker Desktop

#### macOS:
```bash
# С помощью Homebrew:
brew install --cask docker

# Или скачайте с официального сайта:
# https://www.docker.com/products/docker-desktop
```

#### Linux (Ubuntu/Debian):
```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo apt-get install docker-compose-plugin
```

#### Windows:
Скачайте и установите Docker Desktop с [официального сайта](https://www.docker.com/products/docker-desktop).

### Шаг 2: Проверка установки

```bash
# Проверьте версию Docker
docker --version
# Ожидаемый вывод: Docker version 24.0.0+

# Проверьте версию Docker Compose
docker-compose --version
# Ожидаемый вывод: Docker Compose version 2.0.0+

# Проверьте, что Docker запущен
docker info
```

### Шаг 3: Настройка проекта

```bash
# Перейдите в директорию проекта
cd ai-assistant-spec

# Создайте базу данных (если еще не создана)
npm install better-sqlite3 --no-save
node setup-db.js

# Проверьте, что .env.local настроен
cat .env.local
```

### Шаг 4: Сборка и запуск

```bash
# Автоматический запуск (рекомендуется)
./docker-start.sh

# Или вручную:
docker-compose build
docker-compose up -d
```

---

## Управление контейнером

### Запуск контейнера

```bash
./docker-start.sh
# Или:
docker-compose up -d
```

### Остановка контейнера

```bash
./docker-stop.sh
# Или:
docker-compose down
```

### Просмотр логов

```bash
./docker-logs.sh
# Или:
docker-compose logs -f

# Последние 50 строк:
docker-compose logs --tail=50

# Только ошибки:
docker-compose logs | grep ERROR
```

### Перезапуск контейнера

```bash
docker-compose restart

# Или полный пересобор:
./docker-stop.sh
./docker-start.sh
```

### Проверка статуса

```bash
# Список запущенных контейнеров
docker ps

# Статус контейнера
docker-compose ps

# Использование ресурсов
docker stats ai-assistant-app
```

### Вход в контейнер (shell)

```bash
# Bash shell
docker exec -it ai-assistant-app sh

# Выполнение команды
docker exec -it ai-assistant-app ls -la /app
```

---

## Конфигурация

### Структура проекта

```
ai-assistant-spec/
├── Dockerfile              # Описание Docker образа
├── docker-compose.yml      # Конфигурация Docker Compose
├── docker-start.sh         # Скрипт запуска
├── docker-stop.sh          # Скрипт остановки
├── docker-logs.sh          # Скрипт просмотра логов
├── .env.local              # Переменные окружения
├── prisma/
│   └── dev.db              # SQLite база данных (персистентная)
└── logs/
    └── app.log             # Логи приложения (персистентные)
```

### Переменные окружения (.env.local)

```bash
# База данных
DATABASE_URL="file:/app/prisma/dev.db"

# Anthropic API ключ (ОБЯЗАТЕЛЬНО!)
ANTHROPIC_API_KEY="sk-ant-ваш-ключ-здесь"

# Опционально: отключить телеметрию Next.js
NEXT_TELEMETRY_DISABLED=1
```

### Порты

По умолчанию приложение доступно на порту **3000**:
- `http://localhost:3000`

Если порт занят, измените в `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Теперь доступно на localhost:3001
```

### Персистентные данные

Данные сохраняются между перезапусками контейнера:

```yaml
volumes:
  - ./prisma:/app/prisma      # База данных
  - ./logs:/app/logs          # Логи
  - ./.env.local:/app/.env.local:ro  # Конфигурация
```

---

## Troubleshooting

### ❌ Контейнер не запускается

**Проблема**: `docker-compose up` завершается с ошибкой

**Решение**:
```bash
# Проверьте логи
docker-compose logs

# Пересоберите образ
docker-compose build --no-cache
docker-compose up -d

# Проверьте, что порт 3000 не занят
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### ❌ База данных не найдена

**Проблема**: `Error: Cannot find module './prisma/dev.db'`

**Решение**:
```bash
# Создайте базу данных
node setup-db.js

# Убедитесь, что файл существует
ls -la prisma/dev.db

# Перезапустите контейнер
./docker-stop.sh
./docker-start.sh
```

### ❌ API ключ не работает

**Проблема**: `Error: Invalid API key`

**Решение**:
```bash
# Проверьте .env.local
cat .env.local

# Убедитесь, что ключ правильный
# Формат: sk-ant-api03-...

# Перезапустите контейнер после изменений
docker-compose restart
```

### ❌ Порт 3000 занят

**Проблема**: `Error: Port 3000 is already in use`

**Решение**:
```bash
# Найдите процесс, использующий порт
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Остановите процесс или измените порт в docker-compose.yml
```

### ❌ Недостаточно памяти

**Проблема**: `Error: Cannot allocate memory`

**Решение**:
```bash
# Увеличьте лимит памяти в Docker Desktop:
# Settings → Resources → Memory → увеличьте до 4GB+

# Или добавьте в docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 2G
```

### ❌ Медленная сборка образа

**Проблема**: `docker-compose build` занимает много времени

**Решение**:
```bash
# Используйте кеш:
docker-compose build

# Очистите старые образы:
docker image prune -a

# Используйте BuildKit для ускорения:
DOCKER_BUILDKIT=1 docker-compose build
```

### 🔍 Проверка здоровья контейнера

```bash
# Проверка healthcheck
docker inspect ai-assistant-app | grep Health -A 10

# Тест доступности внутри контейнера
docker exec -it ai-assistant-app wget -O- http://localhost:3000

# Проверка переменных окружения
docker exec -it ai-assistant-app env
```

---

## Дополнительные команды

### Очистка Docker

```bash
# Удалить остановленные контейнеры
docker container prune

# Удалить неиспользуемые образы
docker image prune -a

# Удалить все неиспользуемое (контейнеры, образы, сети, volumes)
docker system prune -a --volumes

# ВНИМАНИЕ: это удалит базу данных! Сделайте backup:
cp prisma/dev.db prisma/dev.db.backup
```

### Backup базы данных

```bash
# Создать backup
cp prisma/dev.db "prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)"

# Восстановить из backup
cp prisma/dev.db.backup.20240314_120000 prisma/dev.db
```

### Обновление приложения

```bash
# Получить последние изменения
git pull origin claude/read-project-file-011CUxhFPATd3uJNSpJNTcGw

# Остановить контейнер
./docker-stop.sh

# Пересобрать и запустить
./docker-start.sh
```

---

## 📚 Полезные ссылки

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Anthropic API Documentation](https://docs.anthropic.com/)

---

## 💡 Tips & Tricks

### Автозапуск при старте системы

Добавьте контейнер в автозапуск:

```yaml
# В docker-compose.yml
services:
  app:
    restart: always  # Изменить с unless-stopped на always
```

### Production deployment

Для production используйте:

```bash
# Создайте .env.production
cp .env.local .env.production

# Запустите с production конфигурацией
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Мониторинг ресурсов

```bash
# Real-time мониторинг
docker stats ai-assistant-app

# Экспорт метрик
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

---

**Успешного запуска! 🚀**

Если возникли проблемы, проверьте логи: `./docker-logs.sh`
