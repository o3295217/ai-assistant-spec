-- CreateTable
CREATE TABLE IF NOT EXISTS "user_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "occupation" TEXT,
    "industry" TEXT,
    "maritalStatus" TEXT,
    "hobbies" TEXT,
    "sports" TEXT,
    "location" TEXT,
    "age" INTEGER,
    "education" TEXT,
    "teamSize" INTEGER,
    "workExperience" TEXT,
    "values" TEXT,
    "challenges" TEXT,
    "other" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "profile_blocks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "profile_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "blockId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "profile_items_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "profile_blocks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
