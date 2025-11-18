/**
 * E2E Test: Goal Hierarchy Setup
 * Tests setting up the complete goal hierarchy from dream to weekly goals
 *
 * Critical Path:
 * 1. Set 5-year dream goal
 * 2. Set yearly goals
 * 3. Set half-year, quarter, month, and weekly goals
 * 4. Verify goals are saved and displayed correctly
 */

import { test, expect } from '@playwright/test';

test.describe('Goal Hierarchy Setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/goals');
    await page.waitForLoadState('networkidle');
  });

  test('Complete goal hierarchy setup from dream to week', async ({ page }) => {
    // STEP 1: Set dream goal (5 years)
    await test.step('Set 5-year dream goal', async () => {
      // Should be on Dream tab by default
      await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveText(/мечта/i);

      const dreamText = 'Стать топ-менеджером федеральной IT-компании с управлением департаментом 200+ человек и влиянием на стратегические решения компании';

      await page.fill('[aria-label="Мечта на 5 лет"]', dreamText);
      await page.click('button:has-text("Сохранить")');

      await expect(page.locator('text=Мечта успешно сохранена')).toBeVisible();
    });

    // STEP 2: Set yearly goals
    await test.step('Set yearly goals', async () => {
      await page.click('[role="tab"]:has-text("Год")');
      await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveText(/год/i);

      const yearGoals = `Вырастить Тетроникс Сервис до 50+ сотрудников
Достичь выручки 200 млн рублей
Запустить новое направление в медицине
Выстроить систему управления и делегирования`;

      await page.fill('[aria-label="Цели на год"]', yearGoals);
      await page.click('button:has-text("Сохранить")');

      await expect(page.locator('text=Цели успешно сохранены')).toBeVisible();

      // Verify goals are shown as list
      await expect(page.locator('text=Вырастить Тетроникс Сервис')).toBeVisible();
      await expect(page.locator('text=Достичь выручки 200 млн')).toBeVisible();
    });

    // STEP 3: Set half-year goals
    await test.step('Set half-year goals', async () => {
      await page.click('[role="tab"]:has-text("Полугодие")');

      // Should show current half-year period
      await expect(page.locator('text=/H[12] 202[45]/')).toBeVisible();

      const halfYearGoals = `Завершить реструктуризацию компании
Запустить 2 новых проекта
Увеличить команду на 20 человек`;

      await page.fill('[aria-label="Цели на полугодие"]', halfYearGoals);
      await page.click('button:has-text("Сохранить")');

      await expect(page.locator('text=Цели успешно сохранены')).toBeVisible();
    });

    // STEP 4: Set quarterly goals
    await test.step('Set quarterly goals', async () => {
      await page.click('[role="tab"]:has-text("Квартал")');

      // Should show current quarter (Q1-Q4)
      await expect(page.locator('text=/Q[1-4] 202[45]/')).toBeVisible();

      const quarterGoals = `Завершить систему оплаты труда
Согласовать бюджет на следующий квартал
Провести стратегическую сессию`;

      await page.fill('[aria-label="Цели на квартал"]', quarterGoals);
      await page.click('button:has-text("Сохранить")');

      await expect(page.locator('text=Цели успешно сохранены')).toBeVisible();
    });

    // STEP 5: Set monthly goals
    await test.step('Set monthly goals', async () => {
      await page.click('[role="tab"]:has-text("Месяц")');

      const monthGoals = `Утвердить штатное расписание
Провести ревью команды
Подготовить отчет для совета директоров`;

      await page.fill('[aria-label="Цели на месяц"]', monthGoals);
      await page.click('button:has-text("Сохранить")');

      await expect(page.locator('text=Цели успешно сохранены')).toBeVisible();
    });

    // STEP 6: Set weekly goals
    await test.step('Set weekly goals', async () => {
      await page.click('[role="tab"]:has-text("Неделя")');

      // Should show current week dates (Monday-Sunday)
      await expect(page.locator('text=/\\d{2}\\.\\d{2}\\.(202[45]).*\\d{2}\\.\\d{2}\\.(202[45])/')).toBeVisible();

      const weekGoals = `Завершить систему оплаты труда РОП
Согласовать KPI на декабрь
Провести 3 встречи по проекту ЕНКО
Начать обучение по информационной безопасности`;

      await page.fill('[aria-label="Цели на неделю"]', weekGoals);
      await page.click('button:has-text("Сохранить")');

      await expect(page.locator('text=Цели успешно сохранены')).toBeVisible();
    });

    // STEP 7: Verify all goals are saved by navigating through tabs
    await test.step('Verify all goals are persisted', async () => {
      // Check dream
      await page.click('[role="tab"]:has-text("Мечта")');
      await expect(page.locator('[aria-label="Мечта на 5 лет"]')).toHaveValue(/топ-менеджером федеральной IT-компании/);

      // Check year
      await page.click('[role="tab"]:has-text("Год")');
      await expect(page.locator('text=Вырастить Тетроникс Сервис')).toBeVisible();

      // Check week
      await page.click('[role="tab"]:has-text("Неделя")');
      await expect(page.locator('text=Завершить систему оплаты труда РОП')).toBeVisible();
    });

    // STEP 8: Verify goals appear on dashboard
    await test.step('Verify goals on dashboard', async () => {
      await page.goto('/');

      // Expand goal hierarchy widget
      await page.click('[data-testid="goal-hierarchy-widget"]');

      // Should see all levels
      await expect(page.locator('text=Мечта')).toBeVisible();
      await expect(page.locator('text=Год')).toBeVisible();
      await expect(page.locator('text=Неделя')).toBeVisible();
    });
  });

  test('Should calculate period dates correctly', async ({ page }) => {
    // Week: Should be Monday to Sunday
    await test.step('Verify week period', async () => {
      await page.click('[role="tab"]:has-text("Неделя")');

      const weekDates = await page.locator('[data-testid="period-dates"]').textContent();
      expect(weekDates).toMatch(/Пн.*Вс/);
    });

    // Quarter: Should show Q1-Q4 with correct dates
    await test.step('Verify quarter period', async () => {
      await page.click('[role="tab"]:has-text("Квартал")');

      const quarterInfo = await page.locator('[data-testid="period-dates"]').textContent();

      // November should be Q4: 01.10 - 31.12
      if (quarterInfo?.includes('Q4')) {
        expect(quarterInfo).toContain('01.10');
        expect(quarterInfo).toContain('31.12');
      }
    });

    // Half-year: Should show H1 or H2
    await test.step('Verify half-year period', async () => {
      await page.click('[role="tab"]:has-text("Полугодие")');

      const halfInfo = await page.locator('[data-testid="period-dates"]').textContent();

      // Should be either H1 (Jan-Jun) or H2 (Jul-Dec)
      expect(halfInfo).toMatch(/H[12]/);
    });
  });

  test('Should allow editing individual goals', async ({ page }) => {
    // Set initial goals
    await page.click('[role="tab"]:has-text("Год")');
    await page.fill('[aria-label="Цели на год"]', 'Цель 1\nЦель 2\nЦель 3');
    await page.click('button:has-text("Сохранить")');
    await expect(page.locator('text=Цели успешно сохранены')).toBeVisible();

    // Edit a specific goal
    await test.step('Edit individual goal', async () => {
      const firstGoal = page.locator('[data-testid="goal-item"]').first();
      await firstGoal.hover();
      await firstGoal.locator('[aria-label="Редактировать"]').click();

      await page.fill('[data-testid="goal-edit-input"]', 'Измененная цель 1');
      await page.click('button:has-text("Сохранить изменения")');

      await expect(page.locator('text=Измененная цель 1')).toBeVisible();
      await expect(page.locator('text=Цель 1')).not.toBeVisible();
    });

    // Delete a goal
    await test.step('Delete individual goal', async () => {
      const secondGoal = page.locator('[data-testid="goal-item"]').nth(1);
      await secondGoal.hover();
      await secondGoal.locator('[aria-label="Удалить"]').click();

      // Confirm deletion
      await page.click('button:has-text("Да, удалить")');

      await expect(page.locator('text=Цель 2')).not.toBeVisible();
      await expect(page.locator('text=Измененная цель 1')).toBeVisible();
      await expect(page.locator('text=Цель 3')).toBeVisible();
    });

    // Add new goal
    await test.step('Add new goal to existing list', async () => {
      await page.click('button:has-text("Добавить цель")');
      await page.fill('[data-testid="new-goal-input"]', 'Новая цель 4');
      await page.click('button:has-text("Добавить")');

      await expect(page.locator('text=Новая цель 4')).toBeVisible();
    });
  });

  test('Should validate goals before saving', async ({ page }) => {
    await page.click('[role="tab"]:has-text("Год")');

    // Try to save empty goals
    await page.click('button:has-text("Сохранить")');

    await expect(page.locator('text=Добавьте хотя бы одну цель')).toBeVisible();

    // Try to save whitespace only
    await page.fill('[aria-label="Цели на год"]', '   \n   \n   ');
    await page.click('button:has-text("Сохранить")');

    await expect(page.locator('text=Добавьте хотя бы одну цель')).toBeVisible();
  });

  test('Should preserve unsaved changes when switching tabs', async ({ page }) => {
    // Enter dream goal but don't save
    await page.fill('[aria-label="Мечта на 5 лет"]', 'Несохраненная мечта');

    // Switch to year tab
    await page.click('[role="tab"]:has-text("Год")');

    // Switch back to dream tab
    await page.click('[role="tab"]:has-text("Мечта")');

    // Unsaved text should still be there
    await expect(page.locator('[aria-label="Мечта на 5 лет"]')).toHaveValue('Несохраненная мечта');
  });

  test('Should warn about unsaved changes before leaving page', async ({ page }) => {
    // Enter goal without saving
    await page.fill('[aria-label="Мечта на 5 лет"]', 'Несохраненная мечта');

    // Try to navigate away
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('несохраненные изменения');
      await dialog.dismiss();
    });

    await page.click('text=Главная');

    // Should still be on goals page
    await expect(page).toHaveURL('/goals');
  });

  test('Should handle keyboard shortcuts', async ({ page }) => {
    await page.fill('[aria-label="Мечта на 5 лет"]', 'Тестовая мечта');

    // Save with Ctrl+S
    await page.keyboard.press('Control+s');

    await expect(page.locator('text=Мечта успешно сохранена')).toBeVisible();
  });

  test('Should show character count for goals', async ({ page }) => {
    const textarea = page.locator('[aria-label="Мечта на 5 лет"]');
    await textarea.fill('Тестовый текст мечты');

    const charCount = await page.locator('[data-testid="char-count"]').textContent();
    expect(charCount).toContain('21'); // Length of "Тестовый текст мечты"
  });

  test('Should link to goals from daily planning context', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];

    // First, set some weekly goals
    await page.fill('[aria-label="Мечта на 5 лет"]', 'Мечта');
    await page.click('button:has-text("Сохранить")');

    await page.click('[role="tab"]:has-text("Неделя")');
    await page.fill('[aria-label="Цели на неделю"]', 'Цель недели 1\nЦель недели 2');
    await page.click('button:has-text("Сохранить")');

    // Navigate to daily planning
    await page.goto(`/daily/${today}`);

    // Should see weekly goals in context section
    await expect(page.locator('text=Цель недели 1')).toBeVisible();

    // Click edit link should go to goals page
    await page.click('a:has-text("Редактировать цели")');
    await expect(page).toHaveURL('/goals');
    await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveText(/неделя/i);
  });
});

test.describe('First-time User Onboarding', () => {
  test('Should guide new user through goal setup', async ({ page }) => {
    // Assuming first visit to app
    await page.goto('/');

    // Should show onboarding modal
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    await expect(page.locator('text=Добро пожаловать')).toBeVisible();

    // Click to start onboarding
    await page.click('button:has-text("Начать")');

    // Should navigate to goals page
    await expect(page).toHaveURL('/goals');

    // Should highlight dream goal input
    await expect(page.locator('[data-testid="dream-highlight"]')).toBeVisible();

    // Fill dream and continue
    await page.fill('[aria-label="Мечта на 5 лет"]', 'Моя мечта');
    await page.click('button:has-text("Продолжить")');

    // Should move to year tab
    await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveText(/год/i);
  });
});
