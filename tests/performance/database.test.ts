/**
 * Performance Tests for Database Operations
 * Validates that database queries meet performance requirements:
 * - Database queries < 100ms (per specification)
 */

import { getPrismaTestClient, cleanupDatabase, disconnectPrisma } from '../utils/testHelpers';

describe('Database Performance Tests', () => {
  const prisma = getPrismaTestClient();

  beforeEach(async () => {
    await cleanupDatabase();

    // Create test data
    await seedTestData();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });

  async function seedTestData() {
    // Seed dream goal
    await prisma.dreamGoal.create({
      data: {
        goalText: 'Test dream goal',
      },
    });

    // Seed period goals
    for (const type of ['year', 'half_year', 'quarter', 'month', 'week']) {
      await prisma.periodGoal.create({
        data: {
          periodType: type,
          periodStart: new Date('2025-01-01'),
          periodEnd: new Date('2025-12-31'),
          goalsJson: JSON.stringify(['Goal 1', 'Goal 2']),
        },
      });
    }

    // Seed 100 daily entries with evaluations
    for (let i = 0; i < 100; i++) {
      const date = new Date('2025-11-18');
      date.setDate(date.getDate() - i);

      const entry = await prisma.dailyEntry.create({
        data: {
          date,
          planText: `Plan for day ${i}`,
          factText: `Fact for day ${i}`,
        },
      });

      await prisma.evaluation.create({
        data: {
          dailyEntryId: entry.id,
          strategyScore: 5 + (i % 5),
          operationsScore: 6 + (i % 4),
          teamScore: 7 + (i % 3),
          efficiencyScore: 5 + (i % 6),
          overallScore: 6.0 + (i % 4) * 0.5,
          feedbackText: `Feedback ${i}`,
          planVsFactText: `Analysis ${i}`,
          alignmentDayWeek: 'works',
          alignmentWeekMonth: 'works',
          alignmentMonthQuarter: 'works',
          alignmentQuarterHalf: 'works',
          alignmentHalfYear: 'works',
          alignmentYearDream: 'works',
          recommendationsText: `Recommendations ${i}`,
        },
      });
    }

    // Seed 50 open tasks
    for (let i = 0; i < 50; i++) {
      await prisma.openTask.create({
        data: {
          taskText: `Task ${i}`,
          taskType: i % 2 === 0 ? 'strategic' : 'operational',
          originDate: new Date('2025-11-01'),
          isClosed: i > 40, // First 40 are open, last 10 are closed
        },
      });
    }
  }

  describe('Read Operations', () => {
    it('should fetch dream goal in < 100ms', async () => {
      const start = performance.now();

      await prisma.dreamGoal.findFirst();

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should fetch daily entry by date in < 100ms', async () => {
      const start = performance.now();

      await prisma.dailyEntry.findUnique({
        where: { date: new Date('2025-11-18') },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should fetch daily entry with evaluation in < 100ms', async () => {
      const start = performance.now();

      await prisma.dailyEntry.findUnique({
        where: { date: new Date('2025-11-18') },
        include: { evaluation: true },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should fetch period goals for specific type in < 100ms', async () => {
      const start = performance.now();

      await prisma.periodGoal.findFirst({
        where: { periodType: 'week' },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should fetch daily entries in date range in < 100ms', async () => {
      const start = performance.now();

      await prisma.dailyEntry.findMany({
        where: {
          date: {
            gte: new Date('2025-11-01'),
            lte: new Date('2025-11-15'),
          },
        },
        include: { evaluation: true },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should fetch open tasks filtered by type in < 100ms', async () => {
      const start = performance.now();

      await prisma.openTask.findMany({
        where: {
          isClosed: false,
          taskType: 'strategic',
        },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should fetch last 30 days with evaluations in < 100ms', async () => {
      const start = performance.now();

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      await prisma.dailyEntry.findMany({
        where: {
          date: { gte: thirtyDaysAgo },
        },
        include: { evaluation: true },
        orderBy: { date: 'desc' },
        take: 30,
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Write Operations', () => {
    it('should create dream goal in < 100ms', async () => {
      await cleanupDatabase();

      const start = performance.now();

      await prisma.dreamGoal.create({
        data: { goalText: 'New dream' },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should update dream goal in < 100ms', async () => {
      const dream = await prisma.dreamGoal.create({
        data: { goalText: 'Initial dream' },
      });

      const start = performance.now();

      await prisma.dreamGoal.update({
        where: { id: dream.id },
        data: { goalText: 'Updated dream' },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should create daily entry in < 100ms', async () => {
      const start = performance.now();

      await prisma.dailyEntry.create({
        data: {
          date: new Date('2025-12-01'),
          planText: 'Test plan',
        },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should create evaluation in < 100ms', async () => {
      const entry = await prisma.dailyEntry.create({
        data: {
          date: new Date('2025-12-01'),
          planText: 'Plan',
          factText: 'Fact',
        },
      });

      const start = performance.now();

      await prisma.evaluation.create({
        data: {
          dailyEntryId: entry.id,
          strategyScore: 7,
          operationsScore: 8,
          teamScore: 6,
          efficiencyScore: 7,
          overallScore: 7.0,
          feedbackText: 'Good work',
          planVsFactText: 'Analysis',
          alignmentDayWeek: 'works',
          alignmentWeekMonth: 'works',
          alignmentMonthQuarter: 'works',
          alignmentQuarterHalf: 'works',
          alignmentHalfYear: 'works',
          alignmentYearDream: 'works',
          recommendationsText: 'Keep going',
        },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should update daily entry in < 100ms', async () => {
      const entry = await prisma.dailyEntry.create({
        data: {
          date: new Date('2025-12-01'),
          planText: 'Initial plan',
        },
      });

      const start = performance.now();

      await prisma.dailyEntry.update({
        where: { id: entry.id },
        data: { factText: 'Added fact' },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should close open task in < 100ms', async () => {
      const task = await prisma.openTask.create({
        data: {
          taskText: 'Test task',
          taskType: 'strategic',
          originDate: new Date('2025-11-01'),
          isClosed: false,
        },
      });

      const start = performance.now();

      await prisma.openTask.update({
        where: { id: task.id },
        data: {
          isClosed: true,
          closedAt: new Date(),
        },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Complex Queries', () => {
    it('should fetch all data for evaluation prompt in < 100ms', async () => {
      // This simulates gathering all data needed for Claude API prompt
      const start = performance.now();

      await Promise.all([
        prisma.dreamGoal.findFirst(),
        prisma.periodGoal.findFirst({ where: { periodType: 'year' } }),
        prisma.periodGoal.findFirst({ where: { periodType: 'half_year' } }),
        prisma.periodGoal.findFirst({ where: { periodType: 'quarter' } }),
        prisma.periodGoal.findFirst({ where: { periodType: 'month' } }),
        prisma.periodGoal.findFirst({ where: { periodType: 'week' } }),
        prisma.dailyEntry.findUnique({
          where: { date: new Date('2025-11-18') },
        }),
        prisma.openTask.findMany({
          where: { isClosed: false },
        }),
      ]);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should aggregate weekly statistics in < 100ms', async () => {
      const weekStart = new Date('2025-11-11');
      const weekEnd = new Date('2025-11-17');

      const start = performance.now();

      const entries = await prisma.dailyEntry.findMany({
        where: {
          date: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
        include: { evaluation: true },
      });

      // Calculate average
      const scores = entries
        .filter(e => e.evaluation)
        .map(e => e.evaluation!.overallScore);
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should delete daily entry with cascade in < 100ms', async () => {
      const entry = await prisma.dailyEntry.create({
        data: {
          date: new Date('2025-12-01'),
          planText: 'Plan',
          factText: 'Fact',
        },
      });

      await prisma.evaluation.create({
        data: {
          dailyEntryId: entry.id,
          strategyScore: 7,
          operationsScore: 8,
          teamScore: 6,
          efficiencyScore: 7,
          overallScore: 7.0,
          feedbackText: 'Good',
          planVsFactText: 'Analysis',
          alignmentDayWeek: 'works',
          alignmentWeekMonth: 'works',
          alignmentMonthQuarter: 'works',
          alignmentQuarterHalf: 'works',
          alignmentHalfYear: 'works',
          alignmentYearDream: 'works',
          recommendationsText: 'Recs',
        },
      });

      const start = performance.now();

      await prisma.dailyEntry.delete({
        where: { id: entry.id },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);

      // Verify evaluation was also deleted
      const evaluation = await prisma.evaluation.findFirst({
        where: { dailyEntryId: entry.id },
      });
      expect(evaluation).toBeNull();
    });
  });

  describe('Bulk Operations', () => {
    it('should create multiple period goals in < 100ms', async () => {
      const start = performance.now();

      await prisma.periodGoal.createMany({
        data: [
          {
            periodType: 'year',
            periodStart: new Date('2026-01-01'),
            periodEnd: new Date('2026-12-31'),
            goalsJson: JSON.stringify(['Year goal']),
          },
          {
            periodType: 'month',
            periodStart: new Date('2026-01-01'),
            periodEnd: new Date('2026-01-31'),
            goalsJson: JSON.stringify(['Month goal']),
          },
        ],
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should update multiple open tasks in < 100ms', async () => {
      const start = performance.now();

      await prisma.openTask.updateMany({
        where: {
          isClosed: false,
          taskType: 'operational',
        },
        data: {
          isClosed: true,
          closedAt: new Date(),
        },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Index Performance', () => {
    it('should benefit from date index on daily_entries', async () => {
      // Query without index would be slow
      const start = performance.now();

      await prisma.dailyEntry.findMany({
        where: {
          date: {
            gte: new Date('2025-10-01'),
            lte: new Date('2025-11-30'),
          },
        },
        orderBy: { date: 'desc' },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should benefit from foreign key index on evaluations', async () => {
      const start = performance.now();

      await prisma.evaluation.findMany({
        where: { dailyEntryId: 1 },
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
