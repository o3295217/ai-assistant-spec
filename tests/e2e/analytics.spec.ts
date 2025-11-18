/**
 * E2E Test: Analytics and History Views
 * Tests viewing trends, history, and weekly reports
 */

import { test, expect } from '@playwright/test';

test.describe('Analytics and History', () => {
  test.beforeEach(async ({ page }) => {
    // Assume we have some historical data
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('View evaluation trend graph', async ({ page }) => {
    await page.goto('/analytics');

    // Should show trend graph
    await expect(page.locator('[data-testid="trend-graph"]')).toBeVisible();

    // Default should be 30 days
    await expect(page.locator('text=Последние 30 дней')).toBeVisible();

    // Change period to 60 days
    await page.selectOption('[aria-label="Выбор периода"]', '60');
    await expect(page.locator('text=Последние 60 дней')).toBeVisible();

    // Change to 90 days
    await page.selectOption('[aria-label="Выбор периода"]', '90');
    await expect(page.locator('text=Последние 90 дней')).toBeVisible();
  });

  test('View history calendar', async ({ page }) => {
    await page.goto('/history');

    // Should show calendar view
    await expect(page.locator('[data-testid="history-calendar"]')).toBeVisible();

    // Should show current month
    const currentMonth = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    await expect(page.locator('text=' + currentMonth)).toBeVisible();

    // Days with evaluations should be colored
    const evaluatedDays = page.locator('[data-has-evaluation="true"]');
    await expect(evaluatedDays.first()).toBeVisible();

    // Click on a day with evaluation
    await evaluatedDays.first().click();

    // Should navigate to evaluation page for that day
    await expect(page).toHaveURL(/\/evaluation\/\d{4}-\d{2}-\d{2}/);
  });

  test('Filter history by date range', async ({ page }) => {
    await page.goto('/history');

    // Set date range filter
    await page.fill('[aria-label="Дата начала"]', '2025-11-01');
    await page.fill('[aria-label="Дата окончания"]', '2025-11-15');
    await page.click('button:has-text("Применить")');

    // Should show only days in range
    const days = page.locator('[data-testid="history-day"]');
    const count = await days.count();

    // Verify all days are in range
    for (let i = 0; i < count; i++) {
      const date = await days.nth(i).getAttribute('data-date');
      if (date) {
        const dateObj = new Date(date);
        expect(dateObj >= new Date('2025-11-01')).toBeTruthy();
        expect(dateObj <= new Date('2025-11-15')).toBeTruthy();
      }
    }
  });

  test('View weekly report', async ({ page }) => {
    await page.goto('/reports/week?start=2025-11-11'); // Monday

    // Should show week info
    await expect(page.locator('text=Неделя 11.11.2025 - 17.11.2025')).toBeVisible();

    // Should show weekly goals
    await expect(page.locator('text=Цели недели')).toBeVisible();

    // Should show average score
    await expect(page.locator('[data-testid="week-average-score"]')).toBeVisible();

    // Should show daily scores chart
    await expect(page.locator('[data-testid="week-scores-chart"]')).toBeVisible();

    // Should show all 7 days
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    for (const day of days) {
      await expect(page.locator(`text=${day}`)).toBeVisible();
    }

    // Should show alignment summary
    await expect(page.locator('text=Статистика выравнивания')).toBeVisible();

    // Should show best and worst days
    await expect(page.locator('[data-testid="best-day"]')).toBeVisible();
    await expect(page.locator('[data-testid="worst-day"]')).toBeVisible();
  });

  test('Navigate between weeks in report', async ({ page }) => {
    await page.goto('/reports/week?start=2025-11-11');

    // Go to previous week
    await page.click('[aria-label="Предыдущая неделя"]');
    await expect(page).toHaveURL('/reports/week?start=2025-11-04');
    await expect(page.locator('text=04.11.2025 - 10.11.2025')).toBeVisible();

    // Go to next week
    await page.click('[aria-label="Следующая неделя"]');
    await expect(page).toHaveURL('/reports/week?start=2025-11-11');
  });

  test('View trend statistics', async ({ page }) => {
    await page.goto('/analytics');

    // Should show average score for period
    await expect(page.locator('[data-testid="period-average"]')).toBeVisible();

    // Should show trend indicator (↗️ up, ↘️ down, → stable)
    const trendIndicator = page.locator('[data-testid="trend-indicator"]');
    await expect(trendIndicator).toBeVisible();
    const trendText = await trendIndicator.textContent();
    expect(['↗️', '↘️', '→']).toContain(trendText?.trim());

    // Should show top 3 best days
    await expect(page.locator('text=Лучшие дни')).toBeVisible();
    const bestDays = page.locator('[data-testid="best-day-item"]');
    await expect(bestDays).toHaveCount(3);

    // Should show top 3 worst days
    await expect(page.locator('text=Худшие дни')).toBeVisible();
    const worstDays = page.locator('[data-testid="worst-day-item"]');
    await expect(worstDays).toHaveCount(3);
  });

  test('Hover over graph data points', async ({ page }) => {
    await page.goto('/analytics');

    const graph = page.locator('[data-testid="trend-graph"]');
    const dataPoint = graph.locator('[data-testid="graph-point"]').first();

    // Hover over data point
    await dataPoint.hover();

    // Should show tooltip with details
    const tooltip = page.locator('[data-testid="graph-tooltip"]');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(/Дата:/);
    await expect(tooltip).toContainText(/Оценка:/);
  });

  test('Export report to PDF', async ({ page }) => {
    await page.goto('/reports/week?start=2025-11-11');

    // Click export button
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Экспорт в PDF")'),
    ]);

    // Verify download
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('View individual day from history list', async ({ page }) => {
    await page.goto('/history');

    // Switch to list view
    await page.click('button:has-text("Список")');

    // Should show days as list
    const dayItems = page.locator('[data-testid="history-list-item"]');
    await expect(dayItems.first()).toBeVisible();

    // Each item should show date and score
    const firstItem = dayItems.first();
    await expect(firstItem.locator('[data-testid="day-date"]')).toBeVisible();
    await expect(firstItem.locator('[data-testid="day-score"]')).toBeVisible();

    // Click to view details
    await firstItem.click();
    await expect(page).toHaveURL(/\/evaluation\/\d{4}-\d{2}-\d{2}/);
  });

  test('Color coding in calendar heatmap', async ({ page }) => {
    await page.goto('/history');

    // Days should be color-coded by score
    // Green: score > 7
    const greenDays = page.locator('[data-score-level="high"]');
    if (await greenDays.count() > 0) {
      await expect(greenDays.first()).toHaveClass(/bg-green/);
    }

    // Yellow: score 5-7
    const yellowDays = page.locator('[data-score-level="medium"]');
    if (await yellowDays.count() > 0) {
      await expect(yellowDays.first()).toHaveClass(/bg-yellow/);
    }

    // Red: score < 5
    const redDays = page.locator('[data-score-level="low"]');
    if (await redDays.count() > 0) {
      await expect(redDays.first()).toHaveClass(/bg-red/);
    }
  });

  test('View open tasks page', async ({ page }) => {
    await page.goto('/tasks');

    // Should show open tasks sections
    await expect(page.locator('text=Незакрытые задачи')).toBeVisible();

    // Should be grouped by type
    await expect(page.locator('text=Стратегические')).toBeVisible();
    await expect(page.locator('text=Операционные')).toBeVisible();

    // Each task should show origin date
    const tasks = page.locator('[data-testid="open-task-item"]');
    if (await tasks.count() > 0) {
      await expect(tasks.first().locator('[data-testid="task-origin-date"]')).toBeVisible();
    }
  });

  test('Close an open task', async ({ page }) => {
    await page.goto('/tasks');

    const tasks = page.locator('[data-testid="open-task-item"]');
    const initialCount = await tasks.count();

    if (initialCount > 0) {
      // Click close button on first task
      await tasks.first().locator('button:has-text("Отметить закрытой")').click();

      // Should show confirmation
      await page.click('button:has-text("Подтвердить")');

      // Task should disappear
      await expect(tasks).toHaveCount(initialCount - 1);
    }
  });

  test('Filter open tasks by type', async ({ page }) => {
    await page.goto('/tasks');

    // Filter to strategic only
    await page.click('[data-testid="filter-strategic"]');

    // Should show only strategic tasks
    const tasks = page.locator('[data-testid="open-task-item"]');
    for (let i = 0; i < await tasks.count(); i++) {
      await expect(tasks.nth(i)).toHaveAttribute('data-task-type', 'strategic');
    }

    // Filter to operational only
    await page.click('[data-testid="filter-operational"]');

    for (let i = 0; i < await tasks.count(); i++) {
      await expect(tasks.nth(i)).toHaveAttribute('data-task-type', 'operational');
    }

    // Show all
    await page.click('[data-testid="filter-all"]');
  });

  test('Navigate from dashboard graph to history', async ({ page }) => {
    await page.goto('/');

    // Click on graph
    const graph = page.locator('[data-testid="evaluation-graph"]');
    await graph.click();

    // Should navigate to history
    await expect(page).toHaveURL('/history');
  });

  test('View alignment statistics across multiple days', async ({ page }) => {
    await page.goto('/analytics');

    // Scroll to alignment section
    await page.locator('text=Статистика выравнивания').scrollIntoViewIfNeeded();

    // Should show percentage of days with "works" alignment for each level
    const alignmentStats = page.locator('[data-testid="alignment-stats"]');
    await expect(alignmentStats).toBeVisible();

    // Each level should show percentage
    const levels = [
      'День → Неделя',
      'Неделя → Месяц',
      'Месяц → Квартал',
      'Квартал → Полугодие',
      'Полугодие → Год',
      'Год → Мечта',
    ];

    for (const level of levels) {
      await expect(page.locator(`text=${level}`)).toBeVisible();
      // Should have percentage next to it
      await expect(page.locator(`[data-alignment-level="${level}"]`)).toContainText(/%/);
    }
  });
});

test.describe('Analytics Performance', () => {
  test('Graph should load quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/analytics');
    await page.waitForSelector('[data-testid="trend-graph"]', { state: 'visible' });

    const loadTime = Date.now() - startTime;

    // Should load in under 1 second
    expect(loadTime).toBeLessThan(1000);
  });

  test('Calendar should handle large date ranges', async ({ page }) => {
    await page.goto('/history');

    // Set very large date range (1 year)
    await page.fill('[aria-label="Дата начала"]', '2024-01-01');
    await page.fill('[aria-label="Дата окончания"]', '2024-12-31');
    await page.click('button:has-text("Применить")');

    // Should still be responsive
    await expect(page.locator('[data-testid="history-calendar"]')).toBeVisible();
  });
});
