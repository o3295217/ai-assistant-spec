/**
 * Extended E2E Scenarios
 * Tests complex user journeys and edge cases
 */

import { test, expect } from '@playwright/test';

test.describe('Multi-day Workflow', () => {
  test('Complete workflow across multiple days', async ({ page }) => {
    // Day 1: Set goals and create plan
    await test.step('Day 1: Setup goals and plan', async () => {
      await page.goto('/goals');

      // Set dream and weekly goals
      await page.fill('[aria-label="Мечта на 5 лет"]', 'Стать топ-менеджером');
      await page.click('button:has-text("Сохранить")');

      await page.click('[role="tab"]:has-text("Неделя")');
      await page.fill('[aria-label="Цели на неделю"]', 'Цель 1\nЦель 2\nЦель 3');
      await page.click('button:has-text("Сохранить")');

      // Create plan for Day 1
      await page.goto('/daily/2025-11-18');
      await page.fill('[aria-label="План на день"]', 'План дня 1');
      await page.click('text=Сохранить план');
    });

    // Day 1 evening: Add fact and get evaluation
    await test.step('Day 1: Evening - Add fact and evaluate', async () => {
      await page.goto('/daily/2025-11-18');
      await page.fill('[aria-label="Факт выполнения"]', 'Факт дня 1');
      await page.click('text=Сохранить факт');

      await page.click('button:has-text("Получить оценку")');
      await page.waitForURL('/evaluation/2025-11-18', { timeout: 35000 });

      // Verify evaluation received
      await expect(page.locator('[data-testid="overall-score"]')).toBeVisible();
    });

    // Day 2: Create plan based on Day 1 recommendations
    await test.step('Day 2: Plan based on previous recommendations', async () => {
      // Go to Day 1 evaluation to see recommendations
      await page.goto('/evaluation/2025-11-18');
      const recommendations = await page.locator('[data-testid="recommendations-section"]').textContent();

      // Create Day 2 plan incorporating recommendations
      await page.goto('/daily/2025-11-19');
      await page.fill('[aria-label="План на день"]', `План дня 2\nНа основе: ${recommendations}`);
      await page.click('text=Сохранить план');

      await page.fill('[aria-label="Факт выполнения"]', 'Факт дня 2');
      await page.click('text=Сохранить факт');

      await page.click('button:has-text("Получить оценку")');
      await page.waitForURL('/evaluation/2025-11-19', { timeout: 35000 });
    });

    // Day 3-5: Continue pattern
    for (let day = 20; day <= 22; day++) {
      await test.step(`Day ${day - 17}: Continue pattern`, async () => {
        await page.goto(`/daily/2025-11-${day}`);
        await page.fill('[aria-label="План на день"]', `План дня ${day - 17}`);
        await page.click('text=Сохранить план');
        await page.fill('[aria-label="Факт выполнения"]', `Факт дня ${day - 17}`);
        await page.click('text=Сохранить факт');

        await page.click('button:has-text("Получить оценку")');
        await page.waitForURL(`/evaluation/2025-11-${day}`, { timeout: 35000 });
      });
    }

    // View weekly progress
    await test.step('View weekly summary', async () => {
      await page.goto('/reports/week?start=2025-11-18');

      // Should show all 5 days
      await expect(page.locator('[data-testid="week-average-score"]')).toBeVisible();

      // Should show trend
      await expect(page.locator('[data-testid="week-trend"]')).toBeVisible();
    });

    // View overall analytics
    await test.step('View analytics trends', async () => {
      await page.goto('/analytics');

      // Should show upward/downward/stable trend
      await expect(page.locator('[data-testid="trend-indicator"]')).toBeVisible();

      // Should show all 5 days on graph
      const dataPoints = page.locator('[data-testid="graph-point"]');
      await expect(dataPoints).toHaveCount(5);
    });
  });
});

test.describe('Open Tasks Management', () => {
  test('Track incomplete tasks across days', async ({ page }) => {
    // Day 1: Create plan with 5 tasks
    await page.goto('/daily/2025-11-18');
    await page.fill('[aria-label="План на день"]',
      '1. Задача А\n2. Задача Б\n3. Задача В\n4. Задача Г\n5. Задача Д');
    await page.click('text=Сохранить план');

    // Complete only 2 tasks
    await page.fill('[aria-label="Факт выполнения"]',
      '1. Задача А - выполнена\n2. Задача Б - не сделал\n3. Задача В - выполнена\n4. Задача Г - не сделал\n5. Задача Д - не сделал');
    await page.click('text=Сохранить факт');

    await page.click('button:has-text("Получить оценку")');
    await page.waitForURL('/evaluation/2025-11-18', { timeout: 35000 });

    // Check open tasks page
    await page.goto('/tasks');

    // Should see 3 incomplete tasks (Б, Г, Д)
    const openTasks = page.locator('[data-testid="open-task-item"]');
    await expect(openTasks).toHaveCount(3);

    // Close one task
    await openTasks.first().locator('button:has-text("Отметить закрытой")').click();
    await page.click('button:has-text("Подтвердить")');

    // Should now have 2 open tasks
    await expect(openTasks).toHaveCount(2);

    // Day 2: Reference open tasks in plan
    await page.goto('/daily/2025-11-19');

    // Open tasks should be visible in context
    await expect(page.locator('text=Незакрытые задачи')).toBeVisible();

    // Create plan addressing open tasks
    await page.fill('[aria-label="План на день"]', 'Закрыть задачу Г\nЗакрыть задачу Д');
    await page.click('text=Сохранить план');

    await page.fill('[aria-label="Факт выполнения"]', 'Задача Г - выполнена\nЗадача Д - выполнена');
    await page.click('text=Сохранить факт');

    await page.click('button:has-text("Получить оценку")');
    await page.waitForURL('/evaluation/2025-11-19', { timeout: 35000 });

    // Check that tasks are closed
    await page.goto('/tasks');
    await expect(page.locator('text=Все задачи закрыты')).toBeVisible();
  });
});

test.describe('Goal Evolution', () => {
  test('Update goals and see alignment changes', async ({ page }) => {
    // Set initial goals
    await page.goto('/goals');

    await page.fill('[aria-label="Мечта на 5 лет"]', 'Первоначальная мечта');
    await page.click('button:has-text("Сохранить")');

    await page.click('[role="tab"]:has-text("Неделя")');
    await page.fill('[aria-label="Цели на неделю"]', 'Цель А\nЦель Б');
    await page.click('button:has-text("Сохранить")');

    // Create day aligned with goals
    await page.goto('/daily/2025-11-18');
    await page.fill('[aria-label="План на день"]', 'Работа над целью А');
    await page.click('text=Сохранить план');
    await page.fill('[aria-label="Факт выполнения"]', 'Цель А выполнена');
    await page.click('text=Сохранить факт');

    await page.click('button:has-text("Получить оценку")');
    await page.waitForURL('/evaluation/2025-11-18', { timeout: 35000 });

    // Check initial alignment
    await expect(page.locator('[data-testid="alignment-day-week"]')).toHaveClass(/text-green/); // works

    // Update goals mid-week
    await page.goto('/goals');
    await page.click('[role="tab"]:has-text("Неделя")');
    await page.fill('[aria-label="Цели на неделю"]', 'Новая цель В\nНовая цель Г');
    await page.click('button:has-text("Сохранить")');

    // Create new day plan not aligned with new goals
    await page.goto('/daily/2025-11-19');
    await page.fill('[aria-label="План на день"]', 'Работа над старой целью Б');
    await page.click('text=Сохранить план');
    await page.fill('[aria-label="Факт выполнения"]', 'Старая цель Б выполнена');
    await page.click('text=Сохранить факт');

    await page.click('button:has-text("Получить оценку")');
    await page.waitForURL('/evaluation/2025-11-19', { timeout: 35000 });

    // Check alignment is now worse
    const alignment = await page.locator('[data-testid="alignment-day-week"]').getAttribute('class');
    expect(alignment).toMatch(/text-(yellow|red)/); // partial or no
  });
});

test.describe('Data Export and Backup', () => {
  test('Export all data to JSON', async ({ page }) => {
    await page.goto('/settings');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Экспортировать все данные")'),
    ]);

    expect(download.suggestedFilename()).toContain('.json');

    // Verify download content
    const path = await download.path();
    // Could parse and verify JSON structure
  });

  test('Print evaluation report', async ({ page }) => {
    await page.goto('/evaluation/2025-11-18');

    // Mock print dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    await page.click('button:has-text("Печать")');

    // Verify print-friendly view
    const isPrintView = await page.evaluate(() => {
      return window.matchMedia('print').matches;
    });
  });
});

test.describe('Offline Behavior', () => {
  test('Should show offline indicator', async ({ page, context }) => {
    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    await page.reload();

    // Should show offline message
    await expect(page.locator('text=Нет подключения к интернету')).toBeVisible();

    // Go back online
    await context.setOffline(false);

    await page.reload();

    // Offline message should disappear
    await expect(page.locator('text=Нет подключения к интернету')).not.toBeVisible();
  });

  test('Should queue saves when offline', async ({ page, context }) => {
    await page.goto('/daily/2025-11-18');

    // Go offline
    await context.setOffline(true);

    // Try to save plan
    await page.fill('[aria-label="План на день"]', 'Offline plan');
    await page.click('text=Сохранить план');

    // Should show queued message
    await expect(page.locator('text=Сохранение в очереди')).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Should sync automatically
    await expect(page.locator('text=Синхронизировано')).toBeVisible();
  });
});

test.describe('Accessibility Journey', () => {
  test('Complete workflow using only keyboard', async ({ page }) => {
    await page.goto('/');

    // Navigate to goals using Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Click on Goals link

    await expect(page).toHaveURL('/goals');

    // Fill dream goal with keyboard
    await page.keyboard.press('Tab'); // Focus on textarea
    await page.keyboard.type('Keyboard navigation dream');

    // Save with Ctrl+S
    await page.keyboard.press('Control+s');

    await expect(page.locator('text=Мечта успешно сохранена')).toBeVisible();

    // Navigate tabs with arrow keys
    await page.keyboard.press('ArrowRight'); // Next tab

    // Verify tab changed
    await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveText(/год/i);
  });

  test('Screen reader announces important changes', async ({ page }) => {
    await page.goto('/daily/2025-11-18');

    // Fill and save plan
    await page.fill('[aria-label="План на день"]', 'Test plan');
    await page.click('text=Сохранить план');

    // Check for ARIA live region announcement
    const liveRegion = page.locator('[role="status"]');
    await expect(liveRegion).toHaveText(/сохранен/i);
  });
});

test.describe('Edge Cases', () => {
  test('Handle very long goal text', async ({ page }) => {
    await page.goto('/goals');

    const longText = 'A'.repeat(5000); // 5000 characters

    await page.fill('[aria-label="Мечта на 5 лет"]', longText);
    await page.click('button:has-text("Сохранить")');

    await expect(page.locator('text=Мечта успешно сохранена')).toBeVisible();

    // Verify it saved
    await page.reload();
    await expect(page.locator('[aria-label="Мечта на 5 лет"]')).toHaveValue(longText);
  });

  test('Handle special characters in goals', async ({ page }) => {
    await page.goto('/goals');

    const specialText = 'Goal with "quotes", \'apostrophes\', and émojis 🎯';

    await page.fill('[aria-label="Мечта на 5 лет"]', specialText);
    await page.click('button:has-text("Сохранить")');

    await page.reload();
    await expect(page.locator('[aria-label="Мечта на 5 лет"]')).toHaveValue(specialText);
  });

  test('Handle concurrent saves', async ({ page }) => {
    await page.goto('/daily/2025-11-18');

    // Trigger multiple saves rapidly
    await page.fill('[aria-label="План на день"]', 'First version');
    await page.click('text=Сохранить план');

    await page.fill('[aria-label="План на день"]', 'Second version');
    await page.click('text=Сохранить план');

    await page.fill('[aria-label="План на день"]', 'Third version');
    await page.click('text=Сохранить план');

    // Last save should win
    await page.reload();
    await expect(page.locator('[aria-label="План на день"]')).toHaveValue('Third version');
  });

  test('Handle date boundary cases', async ({ page }) => {
    // Last day of year
    await page.goto('/daily/2025-12-31');
    await page.fill('[aria-label="План на день"]', 'Last day of year');
    await page.click('text=Сохранить план');

    // Navigate to next day (new year)
    await page.click('[aria-label="Следующий день"]');
    await expect(page).toHaveURL('/daily/2026-01-01');

    // Leap year
    await page.goto('/daily/2024-02-29');
    await expect(page.locator('[aria-label="План на день"]')).toBeVisible();
  });
});
