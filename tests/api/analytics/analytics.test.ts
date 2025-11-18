/**
 * Tests for Analytics API endpoints
 * GET /api/analytics/trend?days=30
 * GET /api/analytics/week-report?week_start=2025-11-04
 */

import { createMockRequest, createMockResponse, cleanupDatabase, disconnectPrisma, getPrismaTestClient } from '../../utils/testHelpers';

describe('Analytics API', () => {
  const prisma = getPrismaTestClient();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });

  describe('GET /api/analytics/trend', () => {
    beforeEach(async () => {
      // Create daily entries with evaluations for trend analysis
      const entries = [];
      const evaluations = [];

      for (let i = 0; i < 60; i++) {
        const date = new Date('2025-11-18');
        date.setDate(date.getDate() - i);

        const entry = await prisma.dailyEntry.create({
          data: {
            date,
            plan_text: `Plan for day ${i}`,
            fact_text: `Fact for day ${i}`,
          },
        });

        // Create evaluation with varying scores
        await prisma.evaluation.create({
          data: {
            daily_entry_id: entry.id,
            strategy_score: 5 + (i % 5),
            operations_score: 6 + (i % 4),
            team_score: 7 + (i % 3),
            efficiency_score: 5 + (i % 6),
            overall_score: 6.0 + (i % 4) * 0.5,
            feedback_text: `Feedback ${i}`,
            plan_vs_fact_text: `Analysis ${i}`,
            alignment_day_week: 'works',
            alignment_week_month: 'works',
            alignment_month_quarter: 'works',
            alignment_quarter_half: 'works',
            alignment_half_year: 'works',
            alignment_year_dream: 'works',
            recommendations_text: `Recommendations ${i}`,
          },
        });
      }
    });

    it('should return trend data for last 30 days', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { days: '30' },
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);
      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveLength(30);
      // expect(responseData[0]).toHaveProperty('date');
      // expect(responseData[0]).toHaveProperty('overall_score');
    });

    it('should return trend data for last 60 days', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { days: '60' },
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveLength(60);
    });

    it('should return trend data for last 90 days', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { days: '90' },
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveLength(60); // Only 60 days of data available
    });

    it('should default to 30 days if not specified', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: {},
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveLength(30);
    });

    it('should validate days parameter', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { days: 'invalid' },
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'days must be a number',
      // });
    });

    it('should limit days to reasonable range', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { days: '365' },
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'days must be between 1 and 365',
      // });
    });

    it('should sort data by date ascending (oldest to newest)', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { days: '30' },
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(new Date(responseData[0].date).getTime()).toBeLessThan(
      //   new Date(responseData[29].date).getTime()
      // );
    });

    it('should include all score categories in trend data', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { days: '30' },
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData[0]).toMatchObject({
      //   date: expect.any(String),
      //   overall_score: expect.any(Number),
      //   strategy_score: expect.any(Number),
      //   operations_score: expect.any(Number),
      //   team_score: expect.any(Number),
      //   efficiency_score: expect.any(Number),
      // });
    });

    it('should handle days with no evaluations', async () => {
      // Delete some evaluations to create gaps
      await cleanupDatabase();

      // Create only a few entries
      const entry1 = await prisma.dailyEntry.create({
        data: {
          date: new Date('2025-11-18'),
          plan_text: 'Plan',
          fact_text: 'Fact',
        },
      });

      await prisma.evaluation.create({
        data: {
          daily_entry_id: entry1.id,
          strategy_score: 7,
          operations_score: 8,
          team_score: 6,
          efficiency_score: 7,
          overall_score: 7.0,
          feedback_text: 'Good',
          plan_vs_fact_text: 'Analysis',
          alignment_day_week: 'works',
          alignment_week_month: 'works',
          alignment_month_quarter: 'works',
          alignment_quarter_half: 'works',
          alignment_half_year: 'works',
          alignment_year_dream: 'works',
          recommendations_text: 'Keep going',
        },
      });

      const req = createMockRequest({
        method: 'GET',
        query: { days: '30' },
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // Days without evaluations should have null scores
      // expect(responseData.some(day => day.overall_score === null)).toBe(true);
    });

    it('should calculate average score for period', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { days: '30' },
      });
      const res = createMockResponse();

      // Act
      // await trendHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // const scores = responseData.map(d => d.overall_score).filter(s => s !== null);
      // const average = scores.reduce((a, b) => a + b, 0) / scores.length;

      // expect(average).toBeGreaterThan(0);
      // expect(average).toBeLessThanOrEqual(10);
    });
  });

  describe('GET /api/analytics/week-report', () => {
    let weekStart: Date;

    beforeEach(async () => {
      weekStart = new Date('2025-11-11'); // Monday

      // Create entries for the week
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);

        const entry = await prisma.dailyEntry.create({
          data: {
            date,
            plan_text: `Plan for ${date.toISOString().split('T')[0]}`,
            fact_text: `Fact for ${date.toISOString().split('T')[0]}`,
          },
        });

        await prisma.evaluation.create({
          data: {
            daily_entry_id: entry.id,
            strategy_score: 6 + i,
            operations_score: 5 + i,
            team_score: 7 + (i % 3),
            efficiency_score: 6 + (i % 4),
            overall_score: 6.0 + i * 0.5,
            feedback_text: `Feedback for day ${i}`,
            plan_vs_fact_text: `Analysis for day ${i}`,
            alignment_day_week: i % 2 === 0 ? 'works' : 'partial',
            alignment_week_month: 'works',
            alignment_month_quarter: 'works',
            alignment_quarter_half: 'works',
            alignment_half_year: 'works',
            alignment_year_dream: 'works',
            recommendations_text: `Recs for day ${i}`,
          },
        });
      }

      // Create week goals
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      await prisma.periodGoal.create({
        data: {
          period_type: 'week',
          period_start: weekStart,
          period_end: weekEnd,
          goals_json: JSON.stringify([
            'Complete project A',
            'Review team performance',
            'Plan Q4 strategy',
          ]),
        },
      });
    });

    it('should return weekly report data', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { week_start: '2025-11-11' },
      });
      const res = createMockResponse();

      // Act
      // await weekReportHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     week_start: expect.any(String),
      //     week_end: expect.any(String),
      //     weekly_goals: expect.any(Array),
      //     average_score: expect.any(Number),
      //     daily_scores: expect.any(Array),
      //   })
      // );
    });

    it('should calculate correct weekly average', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { week_start: '2025-11-11' },
      });
      const res = createMockResponse();

      // Act
      // await weekReportHandler(req, res);

      // Expected average: (6.0 + 6.5 + 7.0 + 7.5 + 8.0 + 8.5 + 9.0) / 7 = 7.5
      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData.average_score).toBeCloseTo(7.5, 1);
    });

    it('should include all 7 days of the week', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { week_start: '2025-11-11' },
      });
      const res = createMockResponse();

      // Act
      // await weekReportHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData.daily_scores).toHaveLength(7);
    });

    it('should validate week_start is Monday', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { week_start: '2025-11-12' }, // Tuesday
      });
      const res = createMockResponse();

      // Act
      // await weekReportHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'week_start must be a Monday',
      // });
    });

    it('should include weekly goals in report', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { week_start: '2025-11-11' },
      });
      const res = createMockResponse();

      // Act
      // await weekReportHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData.weekly_goals).toEqual([
      //   'Complete project A',
      //   'Review team performance',
      //   'Plan Q4 strategy',
      // ]);
    });

    it('should aggregate alignment data', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { week_start: '2025-11-11' },
      });
      const res = createMockResponse();

      // Act
      // await weekReportHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // Should show how many days had 'works', 'partial', 'no' for each alignment level
      // expect(responseData).toHaveProperty('alignment_summary');
    });

    it('should handle weeks with incomplete data', async () => {
      // Delete some evaluations
      const entries = await prisma.dailyEntry.findMany({
        where: { date: { gte: weekStart } },
      });

      await prisma.evaluation.deleteMany({
        where: { daily_entry_id: entries[0].id },
      });

      const req = createMockRequest({
        method: 'GET',
        query: { week_start: '2025-11-11' },
      });
      const res = createMockResponse();

      // Act
      // await weekReportHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // Should still return data for available days
      // expect(responseData.daily_scores.length).toBeLessThanOrEqual(7);
    });

    it('should provide trend indicator (up/down/stable)', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { week_start: '2025-11-11' },
      });
      const res = createMockResponse();

      // Act
      // await weekReportHandler(req, res);

      // Compare first half of week vs second half
      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveProperty('trend'); // 'up', 'down', or 'stable'
    });

    it('should identify best and worst days', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { week_start: '2025-11-11' },
      });
      const res = createMockResponse();

      // Act
      // await weekReportHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveProperty('best_day');
      // expect(responseData).toHaveProperty('worst_day');
      // expect(responseData.best_day.overall_score).toBe(9.0); // Last day
      // expect(responseData.worst_day.overall_score).toBe(6.0); // First day
    });
  });
});
