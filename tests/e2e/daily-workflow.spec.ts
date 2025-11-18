/**
 * E2E Test: Complete Daily Workflow
 * Tests the full user journey from morning planning to evening evaluation
 *
 * Critical Path:
 * 1. User creates morning plan
 * 2. User adds evening fact
 * 3. User requests AI evaluation
 * 4. User views evaluation results with alignment
 */

import { test, expect } from '@playwright/test';

test.describe('Complete Daily Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and ensure clean state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Full workflow: Morning plan → Evening fact → Get evaluation → View results', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];

    // STEP 1: Create morning plan
    await test.step('Create morning plan', async () => {
      await page.click('text=Создать план на день');
      await expect(page).toHaveURL(`/daily/${today}`);

      // Enter plan
      const planText = `1. Работа над ИИ ассистентом
2. Калькулятор на 2026 год
3. Штатное расписание на 2026
4. Отправить заявление на обучение
5. Начать курс по ИБ`;

      await page.fill('[aria-label="План на день"]', planText);
      await page.click('text=Сохранить план');

      // Verify success message
      await expect(page.locator('text=План успешно сохранен')).toBeVisible();
    });

    // STEP 2: Add evening fact (simulating end of day)
    await test.step('Add evening fact', async () => {
      // Should still be on daily planning page
      await expect(page).toHaveURL(`/daily/${today}`);

      const factText = `1. ИИ ассистент - частично сделал
2. Калькулятор - готов полностью
3. Штатное расписание - не сделал
4. Заявление - отправил
5. Курс начал`;

      await page.fill('[aria-label="Факт выполнения"]', factText);
      await page.click('text=Сохранить факт');

      await expect(page.locator('text=Факт успешно сохранен')).toBeVisible();
    });

    // STEP 3: Request AI evaluation
    await test.step('Request AI evaluation', async () => {
      const evaluateButton = page.locator('button', { hasText: 'Получить оценку' });
      await expect(evaluateButton).toBeEnabled();

      await evaluateButton.click();

      // Should show loading state
      await expect(page.locator('text=Запрос оценки от ИИ')).toBeVisible();

      // Wait for evaluation to complete (up to 30 seconds as per spec)
      await page.waitForURL(`/evaluation/${today}`, { timeout: 35000 });
    });

    // STEP 4: View evaluation results
    await test.step('View evaluation results', async () => {
      await expect(page).toHaveURL(`/evaluation/${today}`);

      // Verify scores are displayed
      await expect(page.locator('[data-testid="overall-score"]')).toBeVisible();
      await expect(page.locator('text=Стратегическое развитие')).toBeVisible();
      await expect(page.locator('text=Операционное управление')).toBeVisible();
      await expect(page.locator('text=Работа с командой')).toBeVisible();
      await expect(page.locator('text=Эффективность времени')).toBeVisible();

      // Verify plan vs fact analysis is shown
      await expect(page.locator('text=Анализ план vs факт')).toBeVisible();

      // Verify AI feedback is shown
      await expect(page.locator('[data-testid="feedback-section"]')).toBeVisible();

      // Verify alignment visualization exists
      await expect(page.locator('[data-testid="alignment-chain"]')).toBeVisible();

      // Check all 6 alignment levels are present
      const alignmentLevels = [
        'alignment-day-week',
        'alignment-week-month',
        'alignment-month-quarter',
        'alignment-quarter-half',
        'alignment-half-year',
        'alignment-year-dream',
      ];

      for (const level of alignmentLevels) {
        await expect(page.locator(`[data-testid="${level}"]`)).toBeVisible();
      }

      // Verify recommendations are shown
      await expect(page.locator('text=Рекомендации')).toBeVisible();
    });

    // STEP 5: Navigate back to dashboard to see updated data
    await test.step('Return to dashboard and verify', async () => {
      await page.click('text=Вернуться на главную');
      await expect(page).toHaveURL('/');

      // Verify today's evaluation appears on dashboard
      const overallScore = await page.locator('[data-testid="overall-score"]').textContent();
      expect(parseFloat(overallScore || '0')).toBeGreaterThan(0);

      // Verify evaluation graph is updated
      await expect(page.locator('[data-testid="evaluation-graph"]')).toBeVisible();
    });
  });

  test('Should prevent evaluation without plan and fact', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];

    await page.goto(`/daily/${today}`);

    // Try to evaluate without entering anything
    const evaluateButton = page.locator('button', { hasText: 'Получить оценку' });
    await expect(evaluateButton).toBeDisabled();

    // Add plan only
    await page.fill('[aria-label="План на день"]', 'Тестовый план');
    await page.click('text=Сохранить план');

    // Should still be disabled without fact
    await expect(evaluateButton).toBeDisabled();

    // Add fact
    await page.fill('[aria-label="Факт выполнения"]', 'Тестовый факт');
    await page.click('text=Сохранить факт');

    // Now should be enabled
    await expect(evaluateButton).toBeEnabled();
  });

  test('Should handle evaluation API timeout gracefully', async ({ page }) => {
    // This test would require mocking a slow API response
    // For now, we just ensure the UI handles long waits

    const today = new Date().toISOString().split('T')[0];
    await page.goto(`/daily/${today}`);

    await page.fill('[aria-label="План на день"]', 'План');
    await page.click('text=Сохранить план');
    await page.fill('[aria-label="Факт выполнения"]', 'Факт');
    await page.click('text=Сохранить факт');

    // Request evaluation
    await page.click('button:has-text("Получить оценку")');

    // Should show loading state
    await expect(page.locator('text=Запрос оценки')).toBeVisible();

    // Button should be disabled during request
    await expect(page.locator('button:has-text("Получить оценку")')).toBeDisabled();
  });

  test('Should allow editing plan after initial creation', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.goto(`/daily/${today}`);

    // Create initial plan
    await page.fill('[aria-label="План на день"]', 'Первоначальный план');
    await page.click('text=Сохранить план');
    await expect(page.locator('text=План успешно сохранен')).toBeVisible();

    // Edit the plan
    await page.fill('[aria-label="План на день"]', 'Обновленный план');
    await page.click('text=Сохранить план');
    await expect(page.locator('text=План успешно сохранен')).toBeVisible();

    // Reload page and verify updated plan is saved
    await page.reload();
    await expect(page.locator('[aria-label="План на день"]')).toHaveValue('Обновленный план');
  });

  test('Should display context goals while planning', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.goto(`/daily/${today}`);

    // Should see week and month goals for context
    await expect(page.locator('text=Цели на неделю')).toBeVisible();
    await expect(page.locator('text=Цели на месяц')).toBeVisible();

    // Should be able to expand/collapse context sections
    await page.click('[data-testid="week-goals-toggle"]');
    // Goals should be visible
    await expect(page.locator('[data-testid="week-goals-content"]')).toBeVisible();

    await page.click('[data-testid="week-goals-toggle"]');
    // Goals should be hidden
    await expect(page.locator('[data-testid="week-goals-content"]')).not.toBeVisible();
  });

  test('Should auto-save plan after typing pause', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.goto(`/daily/${today}`);

    // Type in plan
    await page.fill('[aria-label="План на день"]', 'Автосохраняемый план');

    // Wait for auto-save (3 second debounce)
    await page.waitForTimeout(3500);

    // Should see auto-save indicator
    await expect(page.locator('text=Автоматически сохранено')).toBeVisible();
  });

  test('Should navigate between days using date picker', async ({ page }) => {
    await page.goto('/daily/2025-11-18');

    // Click next day button
    await page.click('[aria-label="Следующий день"]');
    await expect(page).toHaveURL('/daily/2025-11-19');

    // Click previous day button
    await page.click('[aria-label="Предыдущий день"]');
    await expect(page).toHaveURL('/daily/2025-11-18');

    // Use date picker
    await page.fill('[aria-label="Выбор даты"]', '2025-11-15');
    await page.press('[aria-label="Выбор даты"]', 'Enter');
    await expect(page).toHaveURL('/daily/2025-11-15');
  });

  test('Should show alignment details on click', async ({ page }) => {
    // Assuming we already have an evaluation
    await page.goto('/evaluation/2025-11-18');

    // Click on day-to-week alignment
    await page.click('[data-testid="alignment-day-week"]');

    // Should show modal or expanded section with details
    await expect(page.locator('text=Подробный анализ')).toBeVisible();
    await expect(page.locator('[data-testid="alignment-detail-modal"]')).toBeVisible();

    // Close modal
    await page.click('button:has-text("Закрыть")');
    await expect(page.locator('[data-testid="alignment-detail-modal"]')).not.toBeVisible();
  });
});

test.describe('Edge Cases and Error Handling', () => {
  test('Should handle empty plan validation', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.goto(`/daily/${today}`);

    // Try to save empty plan
    await page.click('text=Сохранить план');

    // Should show validation error
    await expect(page.locator('text=План не может быть пустым')).toBeVisible();
  });

  test('Should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);

    const today = new Date().toISOString().split('T')[0];
    await page.goto(`/daily/${today}`, { waitUntil: 'domcontentloaded' });

    await page.fill('[aria-label="План на день"]', 'Тестовый план');
    await page.click('text=Сохранить план');

    // Should show error message
    await expect(page.locator('text=Ошибка сохранения')).toBeVisible();
    await expect(page.locator('text=Проверьте подключение к интернету')).toBeVisible();

    // Go back online
    await page.context().setOffline(false);
  });

  test('Should warn about unsaved changes', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.goto(`/daily/${today}`);

    // Type something without saving
    await page.fill('[aria-label="План на день"]', 'Несохраненный план');

    // Try to navigate away
    await page.click('text=Главная');

    // Should show confirmation dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('несохраненные изменения');
      await dialog.accept();
    });
  });
});
