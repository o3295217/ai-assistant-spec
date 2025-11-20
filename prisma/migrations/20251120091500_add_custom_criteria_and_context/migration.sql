-- AlterTable: Add contextText to daily_entries
ALTER TABLE "daily_entries" ADD COLUMN "contextText" TEXT;

-- CreateTable: evaluation_criteria
CREATE TABLE "evaluation_criteria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable: user_selected_criteria
CREATE TABLE "user_selected_criteria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL DEFAULT 1,
    "criteriaId" INTEGER NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_selected_criteria_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "evaluation_criteria" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_criteria_key_key" ON "evaluation_criteria"("key");

-- CreateIndex
CREATE UNIQUE INDEX "user_selected_criteria_userId_criteriaId_key" ON "user_selected_criteria"("userId", "criteriaId");

-- Recreate evaluations table with nullable old fields and new scoresJson field
-- Step 1: Rename old table
ALTER TABLE "evaluations" RENAME TO "evaluations_old";

-- Step 2: Create new table with updated schema
CREATE TABLE "evaluations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dailyEntryId" INTEGER NOT NULL,
    "strategyScore" INTEGER,
    "operationsScore" INTEGER,
    "teamScore" INTEGER,
    "efficiencyScore" INTEGER,
    "scoresJson" TEXT,
    "overallScore" REAL NOT NULL,
    "feedbackText" TEXT NOT NULL,
    "planVsFactText" TEXT NOT NULL,
    "alignmentDayWeek" TEXT NOT NULL,
    "alignmentWeekMonth" TEXT NOT NULL,
    "alignmentMonthQuarter" TEXT NOT NULL,
    "alignmentQuarterHalf" TEXT NOT NULL,
    "alignmentHalfYear" TEXT NOT NULL,
    "alignmentYearDream" TEXT NOT NULL,
    "recommendationsText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evaluations_dailyEntryId_fkey" FOREIGN KEY ("dailyEntryId") REFERENCES "daily_entries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Step 3: Copy data from old table
INSERT INTO "evaluations" (
    "id", "dailyEntryId", "strategyScore", "operationsScore", "teamScore", "efficiencyScore",
    "overallScore", "feedbackText", "planVsFactText", "alignmentDayWeek", "alignmentWeekMonth",
    "alignmentMonthQuarter", "alignmentQuarterHalf", "alignmentHalfYear", "alignmentYearDream",
    "recommendationsText", "createdAt"
)
SELECT
    "id", "dailyEntryId", "strategyScore", "operationsScore", "teamScore", "efficiencyScore",
    "overallScore", "feedbackText", "planVsFactText", "alignmentDayWeek", "alignmentWeekMonth",
    "alignmentMonthQuarter", "alignmentQuarterHalf", "alignmentHalfYear", "alignmentYearDream",
    "recommendationsText", "createdAt"
FROM "evaluations_old";

-- Step 4: Drop old table
DROP TABLE "evaluations_old";

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_dailyEntryId_key" ON "evaluations"("dailyEntryId");

-- Insert default criteria
INSERT INTO "evaluation_criteria" ("key", "nameRu", "nameEn", "category", "description", "isDefault", "order") VALUES
('strategy', 'Стратегическое развитие', 'Strategic Development', 'work', 'Работа над долгосрочными целями и стратегическими инициативами', true, 1),
('operations', 'Операционное управление', 'Operational Management', 'work', 'Выполнение текущих операционных задач и процессов', true, 2),
('team', 'Работа с командой', 'Team Management', 'work', 'Взаимодействие с командой, делегирование, менторинг', true, 3),
('efficiency', 'Эффективность времени', 'Time Efficiency', 'work', 'Оптимальное использование времени и ресурсов', true, 4),
('relationships', 'Личные отношения', 'Personal Relationships', 'personal', 'Качество отношений с близкими людьми', false, 5),
('family', 'Семья', 'Family', 'personal', 'Время и забота о семье', false, 6),
('friends', 'Друзья и социальная жизнь', 'Friends & Social', 'personal', 'Общение с друзьями и социальная активность', false, 7),
('learning', 'Обучение', 'Learning', 'development', 'Изучение нового, курсы, книги', false, 8),
('skills', 'Развитие навыков', 'Skills Development', 'development', 'Практика и улучшение профессиональных навыков', false, 9),
('career', 'Карьерный рост', 'Career Growth', 'development', 'Действия для продвижения по карьерной лестнице', false, 10),
('physical_health', 'Физическое здоровье', 'Physical Health', 'health', 'Спорт, питание, сон, общее физическое состояние', false, 11),
('mental_health', 'Ментальное здоровье', 'Mental Health', 'health', 'Психологическое состояние, стресс, эмоциональный баланс', false, 12),
('goals', 'Достижение целей', 'Goal Achievement', 'achievements', 'Прогресс в достижении поставленных целей', false, 13),
('results', 'Конкретные результаты', 'Tangible Results', 'achievements', 'Измеримые результаты и достижения дня', false, 14);

-- Insert default selected criteria for user (ID = 1)
INSERT INTO "user_selected_criteria" ("userId", "criteriaId", "isEnabled", "order", "createdAt", "updatedAt")
SELECT 1, "id", true, "order", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "evaluation_criteria"
WHERE "isDefault" = true;
