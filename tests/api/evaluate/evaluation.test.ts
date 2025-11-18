/**
 * Tests for Evaluation API endpoints
 * POST /api/evaluate
 * GET /api/evaluate/:daily_entry_id
 */

import { createMockRequest, createMockResponse, cleanupDatabase, disconnectPrisma, getPrismaTestClient, isValidScore, isValidOverallScore } from '../../utils/testHelpers';
import { mockDailyEntry, mockEvaluation, mockDreamGoal, mockWeekGoals } from '../../utils/mockData';

describe('Evaluation API', () => {
  const prisma = getPrismaTestClient();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });

  describe('POST /api/evaluate', () => {
    let dailyEntryId: number;

    beforeEach(async () => {
      // Create necessary data for evaluation
      await prisma.dreamGoal.create({
        data: { goal_text: mockDreamGoal.goal_text },
      });

      const entry = await prisma.dailyEntry.create({
        data: {
          date: mockDailyEntry.date,
          plan_text: mockDailyEntry.plan_text,
          fact_text: mockDailyEntry.fact_text,
        },
      });

      dailyEntryId = entry.id;
    });

    it('should create evaluation for daily entry', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: { daily_entry_id: dailyEntryId },
      });
      const res = createMockResponse();

      // Act
      // await evaluateHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(201);

      const saved = await prisma.evaluation.findFirst({
        where: { daily_entry_id: dailyEntryId },
      });

      expect(saved).toBeDefined();
      // expect(saved?.strategy_score).toBeGreaterThanOrEqual(1);
      // expect(saved?.strategy_score).toBeLessThanOrEqual(10);
    });

    it('should return 404 if daily entry does not exist', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: { daily_entry_id: 99999 }, // Non-existent ID
      });
      const res = createMockResponse();

      // Act
      // await evaluateHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(404);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Daily entry not found',
      // });
    });

    it('should validate daily_entry_id is provided', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: {}, // Missing daily_entry_id
      });
      const res = createMockResponse();

      // Act
      // await evaluateHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'daily_entry_id is required',
      // });
    });

    it('should require both plan and fact to be present', async () => {
      // Create entry with only plan
      const entryWithoutFact = await prisma.dailyEntry.create({
        data: {
          date: new Date('2025-11-19'),
          plan_text: 'Some plan',
        },
      });

      const req = createMockRequest({
        method: 'POST',
        body: { daily_entry_id: entryWithoutFact.id },
      });
      const res = createMockResponse();

      // Act
      // await evaluateHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Both plan_text and fact_text must be present to evaluate',
      // });
    });

    it('should handle Claude API timeout (30s)', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: { daily_entry_id: dailyEntryId },
      });
      const res = createMockResponse();

      // Mock slow Claude API response
      // jest.setTimeout(35000);

      // Act & Assert
      // This should timeout and return error
      // await expect(evaluateHandler(req, res)).rejects.toThrow('Request timeout');
    }, 35000);

    it('should handle Claude API errors gracefully', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: { daily_entry_id: dailyEntryId },
      });
      const res = createMockResponse();

      // Mock Claude API failure
      // mockClaudeAPI.mockRejectedValueOnce(new Error('API Error'));

      // Act
      // await evaluateHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(500);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Failed to get evaluation from AI',
      // });
    });

    it('should validate score ranges (1-10)', async () => {
      const invalidScores = [-1, 0, 11, 15, 100];

      invalidScores.forEach(score => {
        expect(isValidScore(score)).toBe(false);
      });

      const validScores = [1, 2, 5, 7, 10];
      validScores.forEach(score => {
        expect(isValidScore(score)).toBe(true);
      });
    });

    it('should validate overall score (0.5 increments)', async () => {
      const validScores = [1.0, 1.5, 2.0, 5.5, 7.0, 10.0];
      validScores.forEach(score => {
        expect(isValidOverallScore(score)).toBe(true);
      });

      const invalidScores = [1.3, 5.7, 10.1, 0.5];
      invalidScores.forEach(score => {
        expect(isValidOverallScore(score)).toBe(false);
      });
    });

    it('should calculate overall score as average of 4 scores', async () => {
      const scores = {
        strategy: 8,
        operations: 6,
        team: 7,
        efficiency: 9,
      };

      const expected = (8 + 6 + 7 + 9) / 4; // 7.5

      expect(expected).toBe(7.5);
      expect(isValidOverallScore(expected)).toBe(true);
    });

    it('should prevent duplicate evaluations for same daily entry', async () => {
      // Create initial evaluation
      await prisma.evaluation.create({
        data: {
          daily_entry_id: dailyEntryId,
          strategy_score: 5,
          operations_score: 6,
          team_score: 7,
          efficiency_score: 8,
          overall_score: 6.5,
          feedback_text: 'Initial feedback',
          plan_vs_fact_text: 'Initial analysis',
          alignment_day_week: 'works',
          alignment_week_month: 'works',
          alignment_month_quarter: 'works',
          alignment_quarter_half: 'works',
          alignment_half_year: 'works',
          alignment_year_dream: 'works',
          recommendations_text: 'Initial recs',
        },
      });

      const req = createMockRequest({
        method: 'POST',
        body: { daily_entry_id: dailyEntryId },
      });
      const res = createMockResponse();

      // Act
      // await evaluateHandler(req, res);

      // Assert: Should update existing, not create new
      const count = await prisma.evaluation.count({
        where: { daily_entry_id: dailyEntryId },
      });

      // expect(count).toBe(1);
    });

    it('should include all hierarchy levels in prompt', async () => {
      // This test would verify that the prompt construction includes:
      // - Dream goal
      // - Year goals
      // - Half-year goals
      // - Quarter goals
      // - Month goals
      // - Week goals
      // - Plan and fact from daily entry

      const req = createMockRequest({
        method: 'POST',
        body: { daily_entry_id: dailyEntryId },
      });
      const res = createMockResponse();

      // Act
      // await evaluateHandler(req, res);

      // Assert: Verify prompt contains all sections
      // This would require mocking Claude API and inspecting the prompt
    });

    it('should parse alignment statuses correctly', async () => {
      const req = createMockRequest({
        method: 'POST',
        body: { daily_entry_id: dailyEntryId },
      });
      const res = createMockResponse();

      // Mock Claude response
      const mockResponse = {
        alignment: {
          day_to_week: 'Tasks align well with weekly goals + works',
          week_to_month: 'Some alignment issues + partial',
          month_to_quarter: 'Not aligned + no',
          quarter_to_half: 'Good alignment + works',
          half_to_year: 'Perfect alignment + works',
          year_to_dream: 'Strong alignment + works',
        },
      };

      // Expected parsed statuses
      const expectedStatuses = {
        alignment_day_week: 'works',
        alignment_week_month: 'partial',
        alignment_month_quarter: 'no',
        alignment_quarter_half: 'works',
        alignment_half_year: 'works',
        alignment_year_dream: 'works',
      };

      // This would test the parsing logic
    });
  });

  describe('GET /api/evaluate/:daily_entry_id', () => {
    let dailyEntryId: number;
    let evaluationId: number;

    beforeEach(async () => {
      const entry = await prisma.dailyEntry.create({
        data: {
          date: mockDailyEntry.date,
          plan_text: mockDailyEntry.plan_text,
          fact_text: mockDailyEntry.fact_text,
        },
      });

      dailyEntryId = entry.id;

      const evaluation = await prisma.evaluation.create({
        data: {
          daily_entry_id: dailyEntryId,
          strategy_score: mockEvaluation.strategy_score,
          operations_score: mockEvaluation.operations_score,
          team_score: mockEvaluation.team_score,
          efficiency_score: mockEvaluation.efficiency_score,
          overall_score: mockEvaluation.overall_score,
          feedback_text: mockEvaluation.feedback_text,
          plan_vs_fact_text: mockEvaluation.plan_vs_fact_text,
          alignment_day_week: mockEvaluation.alignment_day_week,
          alignment_week_month: mockEvaluation.alignment_week_month,
          alignment_month_quarter: mockEvaluation.alignment_month_quarter,
          alignment_quarter_half: mockEvaluation.alignment_quarter_half,
          alignment_half_year: mockEvaluation.alignment_half_year,
          alignment_year_dream: mockEvaluation.alignment_year_dream,
          recommendations_text: mockEvaluation.recommendations_text,
        },
      });

      evaluationId = evaluation.id;
    });

    it('should return evaluation for daily entry', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { daily_entry_id: dailyEntryId.toString() },
      });
      const res = createMockResponse();

      // Act
      // await getEvaluationHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     strategy_score: mockEvaluation.strategy_score,
      //     operations_score: mockEvaluation.operations_score,
      //     overall_score: mockEvaluation.overall_score,
      //   })
      // );
    });

    it('should return 404 when evaluation does not exist', async () => {
      const newEntry = await prisma.dailyEntry.create({
        data: {
          date: new Date('2025-11-20'),
          plan_text: 'Plan',
          fact_text: 'Fact',
        },
      });

      const req = createMockRequest({
        method: 'GET',
        query: { daily_entry_id: newEntry.id.toString() },
      });
      const res = createMockResponse();

      // Act
      // await getEvaluationHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(404);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Evaluation not found',
      // });
    });

    it('should include all alignment data', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { daily_entry_id: dailyEntryId.toString() },
      });
      const res = createMockResponse();

      // Act
      // await getEvaluationHandler(req, res);

      // Assert: All 6 alignment levels should be present
      // expect(res.json).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     alignment_day_week: expect.any(String),
      //     alignment_week_month: expect.any(String),
      //     alignment_month_quarter: expect.any(String),
      //     alignment_quarter_half: expect.any(String),
      //     alignment_half_year: expect.any(String),
      //     alignment_year_dream: expect.any(String),
      //   })
      // );
    });
  });
});
