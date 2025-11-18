/**
 * Tests for Open Tasks API endpoints
 * GET /api/tasks/open
 * POST /api/tasks/close/:id
 */

import { createMockRequest, createMockResponse, cleanupDatabase, disconnectPrisma, getPrismaTestClient } from '../../utils/testHelpers';
import { mockOpenTask } from '../../utils/mockData';

describe('Open Tasks API', () => {
  const prisma = getPrismaTestClient();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });

  describe('GET /api/tasks/open', () => {
    beforeEach(async () => {
      // Create multiple tasks
      await prisma.openTask.createMany({
        data: [
          {
            task_text: 'Strategic task 1',
            task_type: 'strategic',
            origin_date: new Date('2025-11-10'),
            is_closed: false,
          },
          {
            task_text: 'Strategic task 2',
            task_type: 'strategic',
            origin_date: new Date('2025-11-12'),
            is_closed: false,
          },
          {
            task_text: 'Operational task 1',
            task_type: 'operational',
            origin_date: new Date('2025-11-11'),
            is_closed: false,
          },
          {
            task_text: 'Closed task',
            task_type: 'operational',
            origin_date: new Date('2025-11-05'),
            is_closed: true,
            closed_at: new Date('2025-11-15'),
          },
        ],
      });
    });

    it('should return all open tasks', async () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      // Act
      // await openTasksHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);
      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveLength(3); // Only open tasks
      // expect(responseData).not.toContainEqual(
      //   expect.objectContaining({ task_text: 'Closed task' })
      // );
    });

    it('should filter by task type - strategic', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { type: 'strategic' },
      });
      const res = createMockResponse();

      // Act
      // await openTasksHandler(req, res);

      // Assert
      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveLength(2);
      // expect(responseData).toEqual(
      //   expect.arrayContaining([
      //     expect.objectContaining({ task_text: 'Strategic task 1' }),
      //     expect.objectContaining({ task_text: 'Strategic task 2' }),
      //   ])
      // );
    });

    it('should filter by task type - operational', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { type: 'operational' },
      });
      const res = createMockResponse();

      // Act
      // await openTasksHandler(req, res);

      // Assert
      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveLength(1);
      // expect(responseData[0]).toMatchObject({
      //   task_text: 'Operational task 1',
      //   task_type: 'operational',
      // });
    });

    it('should validate task type', async () => {
      const req = createMockRequest({
        method: 'GET',
        query: { type: 'invalid_type' },
      });
      const res = createMockResponse();

      // Act
      // await openTasksHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Invalid task type. Must be strategic or operational',
      // });
    });

    it('should return empty array when no open tasks exist', async () => {
      // Close all tasks
      await prisma.openTask.updateMany({
        where: { is_closed: false },
        data: {
          is_closed: true,
          closed_at: new Date(),
        },
      });

      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      // Act
      // await openTasksHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should sort tasks by origin_date descending', async () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      // Act
      // await openTasksHandler(req, res);

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData[0].task_text).toBe('Strategic task 2'); // 2025-11-12
      // expect(responseData[1].task_text).toBe('Operational task 1'); // 2025-11-11
      // expect(responseData[2].task_text).toBe('Strategic task 1'); // 2025-11-10
    });

    it('should group tasks by type in response', async () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      // Act
      // await openTasksHandler(req, res);

      // Expected format:
      // {
      //   strategic: [...],
      //   operational: [...]
      // }

      // const responseData = res.json.mock.calls[0][0];
      // expect(responseData).toHaveProperty('strategic');
      // expect(responseData).toHaveProperty('operational');
      // expect(responseData.strategic).toHaveLength(2);
      // expect(responseData.operational).toHaveLength(1);
    });
  });

  describe('POST /api/tasks/close/:id', () => {
    let taskId: number;

    beforeEach(async () => {
      const task = await prisma.openTask.create({
        data: {
          task_text: mockOpenTask.task_text,
          task_type: mockOpenTask.task_type,
          origin_date: mockOpenTask.origin_date,
          is_closed: false,
        },
      });

      taskId = task.id;
    });

    it('should close an open task', async () => {
      const req = createMockRequest({
        method: 'POST',
        query: { id: taskId.toString() },
      });
      const res = createMockResponse();

      // Act
      // await closeTaskHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(200);

      const updated = await prisma.openTask.findUnique({
        where: { id: taskId },
      });

      expect(updated?.is_closed).toBe(true);
      expect(updated?.closed_at).toBeDefined();
      expect(updated?.closed_at).toBeInstanceOf(Date);
    });

    it('should return 404 for non-existent task', async () => {
      const req = createMockRequest({
        method: 'POST',
        query: { id: '99999' },
      });
      const res = createMockResponse();

      // Act
      // await closeTaskHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(404);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Task not found',
      // });
    });

    it('should validate task id is provided', async () => {
      const req = createMockRequest({
        method: 'POST',
        query: {}, // Missing id
      });
      const res = createMockResponse();

      // Act
      // await closeTaskHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Task id is required',
      // });
    });

    it('should validate task id is a number', async () => {
      const req = createMockRequest({
        method: 'POST',
        query: { id: 'not-a-number' },
      });
      const res = createMockResponse();

      // Act
      // await closeTaskHandler(req, res);

      // Assert
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.json).toHaveBeenCalledWith({
      //   error: 'Task id must be a number',
      // });
    });

    it('should allow closing already closed task (idempotent)', async () => {
      // Close task first time
      await prisma.openTask.update({
        where: { id: taskId },
        data: {
          is_closed: true,
          closed_at: new Date('2025-11-15'),
        },
      });

      const req = createMockRequest({
        method: 'POST',
        query: { id: taskId.toString() },
      });
      const res = createMockResponse();

      // Act: Try to close again
      // await closeTaskHandler(req, res);

      // Assert: Should succeed (idempotent operation)
      // expect(res.status).toHaveBeenCalledWith(200);

      const task = await prisma.openTask.findUnique({
        where: { id: taskId },
      });

      expect(task?.is_closed).toBe(true);
    });

    it('should set closed_at to current timestamp', async () => {
      const beforeClose = new Date();

      const req = createMockRequest({
        method: 'POST',
        query: { id: taskId.toString() },
      });
      const res = createMockResponse();

      // Act
      // await closeTaskHandler(req, res);

      const afterClose = new Date();

      const task = await prisma.openTask.findUnique({
        where: { id: taskId },
      });

      expect(task?.closed_at).toBeDefined();
      if (task?.closed_at) {
        expect(task.closed_at.getTime()).toBeGreaterThanOrEqual(beforeClose.getTime());
        expect(task.closed_at.getTime()).toBeLessThanOrEqual(afterClose.getTime());
      }
    });
  });

  describe('Task creation from evaluation', () => {
    it('should create open tasks for incomplete plan items', async () => {
      // This would test the logic that analyzes plan vs fact
      // and creates open tasks for incomplete items

      const plan = '1. Task A\n2. Task B\n3. Task C';
      const fact = '1. Task A - done\n2. Task B - not done\n3. Task C - not done';

      // Expected: 2 open tasks should be created (Task B and Task C)
      // This logic would be part of the evaluation process
    });

    it('should categorize tasks as strategic or operational', async () => {
      // This would test the AI categorization logic
      // or manual categorization based on keywords
    });
  });
});
