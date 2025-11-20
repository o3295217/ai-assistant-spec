# Логирование в приложении

## 📝 Где находятся логи

### 1. Next.js Development Logs
**Путь:** `.next/dev/logs/next-development.log`

Автоматически создаются Next.js в режиме разработки.

**Содержат:**
- Статус запуска сервера
- Ошибки компиляции
- Предупреждения
- Проблемы с сетью

**Пример:**
```
[00:00:02.655] Server  LOG      ✓ Ready in 1750ms
[00:00:32.007] Server  WARN     ⚠ Failed to download Inter from Google Fonts
```

### 2. Application Logs
**Путь:** `logs/app.log`

Пользовательские логи приложения (если используется logger).

**Формат:** JSON для удобного парсинга

---

## 🔧 Как использовать логгер

### Импорт
```typescript
import { logger } from '@/lib/logger'
```

### Примеры использования

#### В API Route
```typescript
// src/app/api/evaluate/route.ts
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date } = body

    logger.info('Evaluation request received', { date })

    // ... ваш код ...

    // Логируем успешный результат
    logger.info('Evaluation completed', {
      date,
      score: evaluation.overallScore
    })

    return NextResponse.json({ evaluation })

  } catch (error: any) {
    // Логируем ошибку
    logger.error('Evaluation failed', {
      error: error.message,
      stack: error.stack
    })

    return NextResponse.json(
      { error: 'Failed to evaluate' },
      { status: 500 }
    )
  }
}
```

#### В Server Component
```typescript
// src/app/page.tsx
import { logger } from '@/lib/logger'

export default async function Home() {
  logger.info('Home page rendered')
  // ... ваш код ...
}
```

#### При работе с БД
```typescript
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const entry = await prisma.dailyEntry.findFirst({ where: { date } })

if (!entry) {
  logger.warn('Daily entry not found', { date })
} else {
  logger.info('Daily entry loaded', { date, hasEvaluation: !!entry.evaluation })
}
```

#### При запросах к Claude API
```typescript
import { logger } from '@/lib/logger'
import { anthropic } from '@/lib/anthropic'

logger.info('Sending request to Claude API', { date, model: MODEL_NAME })

const response = await anthropic.messages.create({
  model: MODEL_NAME,
  max_tokens: 4000,
  messages: [{ role: 'user', content: prompt }],
})

logger.info('Claude API response received', {
  tokens: response.usage?.input_tokens,
  date
})
```

---

## 📊 Формат логов

### JSON формат (в файле logs/app.log):
```json
{"timestamp":"2025-11-13T17:45:00.000Z","level":"INFO","message":"Evaluation request received","data":{"date":"2025-11-13"}}
{"timestamp":"2025-11-13T17:45:05.123Z","level":"INFO","message":"Claude API response received","data":{"tokens":1234,"date":"2025-11-13"}}
{"timestamp":"2025-11-13T17:45:06.456Z","level":"ERROR","message":"Database query failed","data":{"error":"Connection timeout"}}
```

### Console вывод:
```
[INFO] Evaluation request received { date: '2025-11-13' }
[INFO] Claude API response received { tokens: 1234, date: '2025-11-13' }
[ERROR] Database query failed { error: 'Connection timeout' }
```

---

## 🔍 Просмотр логов

### Tail (следить в реальном времени)
```bash
tail -f logs/app.log
```

### Grep (поиск по логам)
```bash
# Найти все ошибки
grep "ERROR" logs/app.log

# Найти логи за определенную дату
grep "2025-11-13" logs/app.log

# Найти логи связанные с Claude API
grep "Claude API" logs/app.log
```

### Парсинг JSON
```bash
# С помощью jq (если установлен)
cat logs/app.log | jq 'select(.level=="ERROR")'

# Показать только ошибки за последний час
cat logs/app.log | jq 'select(.level=="ERROR") | select(.timestamp > "2025-11-13T16:00:00Z")'
```

---

## 🗑️ Очистка логов

### Вручную
```bash
# Удалить старые логи
rm logs/app.log

# Или очистить содержимое
echo "" > logs/app.log
```

### Автоматическая ротация (опционально)

Можно настроить ротацию логов с помощью пакета `winston-daily-rotate-file`:

```bash
npm install winston winston-daily-rotate-file
```

---

## ⚙️ Уровни логирования

| Уровень | Когда использовать | Пример |
|---------|-------------------|--------|
| `INFO` | Обычные события | "User created plan", "API request received" |
| `WARN` | Потенциальные проблемы | "API key not set", "Slow query detected" |
| `ERROR` | Ошибки требующие внимания | "Database connection failed", "API request failed" |

---

## 📌 Что логировать

### ✅ Хорошо логировать:
- Начало и конец важных операций
- Запросы к внешним API (Claude)
- Ошибки и исключения
- Критические бизнес-события (создание оценки, обновление целей)
- Производительность (медленные запросы)

### ❌ Не логировать:
- Пароли и секретные ключи
- Личные данные пользователей
- Большие объемы данных (весь response от API)
- Каждый рендер компонента

---

## 🔐 Безопасность

**Важно:** Логи могут содержать чувствительные данные!

- ✅ Добавлен `logs/` в `.gitignore`
- ✅ Не коммитить логи в git
- ✅ Не логировать API ключи
- ✅ Не логировать пароли
- ⚠️ Осторожно с личными данными

---

## 💡 Советы

1. **Используйте структурированное логирование** (JSON) для легкого парсинга
2. **Добавляйте контекст** (дату, ID пользователя, имя операции)
3. **Логируйте только важное** (не переполняйте логи)
4. **Регулярно очищайте старые логи**
5. **Используйте разные уровни** (INFO/WARN/ERROR) для фильтрации
