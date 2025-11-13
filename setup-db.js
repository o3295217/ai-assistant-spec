// Скрипт для создания базы данных SQLite
const fs = require('fs');
const path = require('path');

// Читаем SQL миграцию
const migrationSQL = fs.readFileSync(
  path.join(__dirname, 'prisma/migrations/20251109_init/migration.sql'),
  'utf8'
);

// Создаем пустую базу данных
const dbPath = path.join(__dirname, 'prisma/dev.db');

// Используем better-sqlite3 (встроен в Prisma)
const Database = require('better-sqlite3');
const db = new Database(dbPath);

// Выполняем миграцию
try {
  db.exec(migrationSQL);
  console.log('✅ База данных успешно создана: prisma/dev.db');
  console.log('✅ Таблицы созданы: dream_goal, period_goals, daily_entries, evaluations, open_tasks');
} catch (error) {
  console.error('❌ Ошибка при создании базы данных:', error.message);
  process.exit(1);
} finally {
  db.close();
}
