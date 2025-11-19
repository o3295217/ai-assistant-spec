-- CreateTable
CREATE TABLE "dream_goal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "goalText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "period_goals" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "periodType" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "goalsJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "daily_entries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "planText" TEXT,
    "factText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dailyEntryId" INTEGER NOT NULL,
    "strategyScore" INTEGER NOT NULL,
    "operationsScore" INTEGER NOT NULL,
    "teamScore" INTEGER NOT NULL,
    "efficiencyScore" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "open_tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskText" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "originDate" DATETIME NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "closedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_entries_date_key" ON "daily_entries"("date");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_dailyEntryId_key" ON "evaluations"("dailyEntryId");
