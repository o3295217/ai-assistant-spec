/**
 * Test Helper Functions
 * Utilities for setting up and tearing down test data
 */

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

/**
 * Get Prisma test client
 */
export function getPrismaTestClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  return prisma;
}

/**
 * Clean up test database
 */
export async function cleanupDatabase() {
  const prisma = getPrismaTestClient();

  await prisma.evaluation.deleteMany();
  await prisma.dailyEntry.deleteMany();
  await prisma.openTask.deleteMany();
  await prisma.periodGoal.deleteMany();
  await prisma.dreamGoal.deleteMany();
}

/**
 * Disconnect Prisma client
 */
export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
  }
}

/**
 * Create test request/response objects for Next.js API routes
 */
export function createMockRequest(options: {
  method?: string;
  query?: Record<string, string>;
  body?: any;
  headers?: Record<string, string>;
}) {
  return {
    method: options.method || 'GET',
    query: options.query || {},
    body: options.body || {},
    headers: options.headers || {},
  };
}

export function createMockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
}

/**
 * Validate score range (1-10)
 */
export function isValidScore(score: number): boolean {
  return score >= 1 && score <= 10 && Number.isInteger(score);
}

/**
 * Validate overall score (1-10, allows 0.5 increments)
 */
export function isValidOverallScore(score: number): boolean {
  return score >= 1 && score <= 10 && score % 0.5 === 0;
}

/**
 * Validate alignment status
 */
export function isValidAlignmentStatus(status: string): boolean {
  return ['works', 'partial', 'no'].includes(status);
}

/**
 * Parse alignment status from text
 * Expected format: "analysis text + status"
 */
export function parseAlignmentStatus(text: string): string | null {
  const match = text.match(/\s+(works|partial|no)\s*$/i);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Get current period dates for testing
 */
export function getCurrentPeriodDates(periodType: string): { start: Date; end: Date } {
  const now = new Date('2025-11-18'); // Fixed test date

  switch (periodType) {
    case 'week': {
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Monday
      const start = new Date(now);
      start.setDate(now.getDate() + diff);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end };
    }

    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start, end };
    }

    case 'quarter': {
      const quarter = Math.floor(now.getMonth() / 3);
      const start = new Date(now.getFullYear(), quarter * 3, 1);
      const end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
      return { start, end };
    }

    case 'half_year': {
      const half = now.getMonth() < 6 ? 0 : 1;
      const start = new Date(now.getFullYear(), half * 6, 1);
      const end = new Date(now.getFullYear(), half * 6 + 6, 0);
      return { start, end };
    }

    case 'year': {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return { start, end };
    }

    default:
      throw new Error(`Unknown period type: ${periodType}`);
  }
}
