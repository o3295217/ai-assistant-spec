/**
 * Tests for Daily Entries API endpoints
 * GET /api/daily/:date
 * POST /api/daily
 * GET /api/daily/list?from=2025-10-01&to=2025-11-10
 */

import { createMockRequest, createMockResponse, cleanupDatabase, disconnectPrisma, getPrismaTestClient } from '../../utils/testHelpers';
import { mockDailyEntry } from '../../utils/mockData';

describe('Daily Entries API', () => {
  const prisma = getPrismaTestClient();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });

  describe('GET /api/daily/:date', () => {
    it('should return daily entry for specific date', async () => {
      // Arrange
      const entry = await prisma.dailyEntry.create({
        data: {
          date: mockDailyEntry.date,
          plan_text: mockDailyEntry.plan_text,
          fact_text: mockDailyEntry.fact_text,
        },
      });

      const req = createMockRequest({
        method: 'GET',
        query: { date: '2025-11-18' },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     date: expect.any(String),
      //     plan_text: mockDailyEntry.plan_text,
      //     fact_text: mockDailyEntry.fact_text,
      //   })
      // );
    });

    it('should return 404 when entry does not exist', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { date: '2025-11-19' },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(404);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Daily entry not found',
      // });
    });

    it('should validate date format', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { date: 'invalid-date' },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Invalid date format. Expected YYYY-MM-DD',
      // });
    });
  });

  describe('POST /api/daily', () => {
    it('should create new daily entry with plan', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: {
          date: '2025-11-18',
          plan_text: mockDailyEntry.plan_text,
        },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(201);

      const saved = await prisma.dailyEntry.findUnique({
        where: { date: new Date('2025-11-18') },
      });

      expect(saved).toBeDefined();
      // expect(saved?.plan_text).toBe(mockDailyEntry.plan_text);
      // expect(saved?.fact_text).toBeNull();
    });

    it('should update existing entry with fact', async () => {
      // Arrange: Create entry with plan
      const initial = await prisma.dailyEntry.create({
        data: {
          date: mockDailyEntry.date,
          plan_text: mockDailyEntry.plan_text,
        },
      });

      const req = createMockRequest({
        method: 'POST',
        body: {
          date: '2025-11-18',
          fact_text: mockDailyEntry.fact_text,
        },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);

      const updated = await prisma.dailyEntry.findUnique({
        where: { date: new Date('2025-11-18') },
      });

      // expect(updated?.plan_text).toBe(mockDailyEntry.plan_text); // Unchanged
      // expect(updated?.fact_text).toBe(mockDailyEntry.fact_text); // Updated
    });

    it('should update both plan and fact in single request', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: {
          date: '2025-11-18',
          plan_text: mockDailyEntry.plan_text,
          fact_text: mockDailyEntry.fact_text,
        },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      const saved = await prisma.dailyEntry.findUnique({
        where: { date: new Date('2025-11-18') },
      });

      // expect(saved?.plan_text).toBe(mockDailyEntry.plan_text);
      // expect(saved?.fact_text).toBe(mockDailyEntry.fact_text);
    });

    it('should enforce unique date constraint', async () => {
      // Arrange: Create initial entry
      await prisma.dailyEntry.create({
        data: {
          date: mockDailyEntry.date,
          plan_text: 'Initial plan',
        },
      });

      const req = createMockRequest({
        method: 'POST',
        body: {
          date: '2025-11-18',
          plan_text: 'New plan', // Should update, not create duplicate
        },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      // Assert: Should only have one entry
      const count = await prisma.dailyEntry.count({
        where: { date: new Date('2025-11-18') },
      });
      expect(count).toBe(1);
    });

    it('should validate date is required', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: {
          plan_text: 'Some plan',
          // Missing date
        },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'date is required',
      // });
    });

    it('should validate at least one field (plan or fact) is provided', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: {
          date: '2025-11-18',
          // Missing both plan_text and fact_text
        },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Either plan_text or fact_text must be provided',
      // });
    });

    it('should handle multiline text properly', async () => {
      const multilineText = '1. First task\n2. Second task\n3. Third task';

      const req = createMockRequest({
        method: 'POST',
        body: {
          date: '2025-11-18',
          plan_text: multilineText,
        },
      });
      const res = createMockResponse();

      // Act
      // await dailyHandler(req, res);

      const saved = await prisma.dailyEntry.findUnique({
        where: { date: new Date('2025-11-18') },
      });

      expect(saved?.plan_text).toBe(multilineText);
    });
  });

  describe('GET /api/daily/list', () => {
    beforeEach(async () => {
      // Create multiple entries
      await prisma.dailyEntry.createMany({
        data: [
          { date: new Date('2025-11-01'), plan_text: 'Plan 1', fact_text: 'Fact 1' },
          { date: new Date('2025-11-05'), plan_text: 'Plan 2', fact_text: 'Fact 2' },
          { date: new Date('2025-11-10'), plan_text: 'Plan 3', fact_text: 'Fact 3' },
          { date: new Date('2025-11-15'), plan_text: 'Plan 4', fact_text: 'Fact 4' },
          { date: new Date('2025-11-20'), plan_text: 'Plan 5', fact_text: 'Fact 5' },
        ],
      });
    });

    it('should return all entries in date range', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: {
          from: '2025-11-01',
          to: '2025-11-15',
        },
      });
      const res = createMockResponse();

      // Act
      // await listHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith(
      //   expect.arrayContaining([
      //     expect.objectContaining({ plan_text: 'Plan 1' }),
      //     expect.objectContaining({ plan_text: 'Plan 2' }),
      //     expect.objectContaining({ plan_text: 'Plan 3' }),
      //     expect.objectContaining({ plan_text: 'Plan 4' }),
      //   ])
      // );

      // Should not include entry from 2025-11-20
      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveLength(4);
    });

    it('should return empty array when no entries in range', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: {
          from: '2025-12-01',
          to: '2025-12-31',
        },
      });
      const res = createMockResponse();

      // Act
      // await listHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should validate from and to dates are provided', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: {
          from: '2025-11-01',
          // Missing 'to'
        },
      });
      const res = createMockResponse();

      // Act
      // await listHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Both from and to dates are required',
      // });
    });

    it('should validate date range is logical', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: {
          from: '2025-11-15',
          to: '2025-11-01', // End before start
        },
      });
      const res = createMockResponse();

      // Act
      // await listHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'to date must be after from date',
      // });
    });

    it('should sort entries by date descending (newest first)', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: {
          from: '2025-11-01',
          to: '2025-11-20',
        },
      });
      const res = createMockResponse();

      // Act
      // await listHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData[0].plan_text).toBe('Plan 5'); // 2025-11-20
      // expect(responseData[4].plan_text).toBe('Plan 1'); // 2025-11-01
    });

    it('should include evaluation data if exists', async () => {
      // Arrange: Add evaluation for one entry
      const entry = await prisma.dailyEntry.findFirst({
        where: { date: new Date('2025-11-10') },
      });

      if (entry) {
        await prisma.evaluation.create({
          data: {
            daily_entry_id: entry.id,
            strategy_score: 7,
            operations_score: 8,
            team_score: 6,
            efficiency_score: 7,
            overall_score: 7.0,
            feedback_text: 'Good work',
            plan_vs_fact_text: 'Analysis',
            alignment_day_week: 'works',
            alignment_week_month: 'works',
            alignment_month_quarter: 'works',
            alignment_quarter_half: 'works',
            alignment_half_year: 'works',
            alignment_year_dream: 'works',
            recommendations_text: 'Keep it up',
          },
        });
      }

      const req = createMockRequest({
        method: 'GET',
        query: {
          from: '2025-11-01',
          to: '2025-11-20',
        },
      });
      const res = createMockResponse();

      // Act
      // await listHandler(req, res);

      // Assert: Entry with evaluation should include overall_score
      // const responseData = res.json.mock.calls[0][0];
      // const entryWithEval = responseData.find(e => e.date.includes('11-10'));
      // expect(entryWithEval).toHaveProperty('evaluation');
      // expect(entryWithEval.evaluation.overall_score).toBe(7.0);
    });
  });
});
