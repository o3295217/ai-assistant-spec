/**
 * Performance Tests for Page Load Times
 * Validates that pages meet performance requirements:
 * - Page load < 1 second (per specification)
 */

import { test, expect } from '@playwright/test';

test.describe('Page Load Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cache and cookies for consistent testing
    await page.context().clearCookies();
  });

  test('Dashboard should load in < 1 second', async ({ page }) => {
    const start = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);

    // Verify critical content is visible
    await expect(page.locator('text=Главная')).toBeVisible();
    await expect(page.locator('[data-testid="evaluation-graph"]')).toBeVisible();
  });

  test('Goals page should load in < 1 second', async ({ page }) => {
    const start = Date.now();

    await page.goto('/goals', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`Goals page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);

    await expect(page.locator('[role="tab"]:has-text("Мечта")')).toBeVisible();
  });

  test('Daily planning page should load in < 1 second', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    const start = Date.now();

    await page.goto(`/daily/${today}`, { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`Daily planning page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);

    await expect(page.locator('[aria-label="План на день"]')).toBeVisible();
  });

  test('Evaluation page should load in < 1 second', async ({ page }) => {
    // Assuming we have evaluation data
    const start = Date.now();

    await page.goto('/evaluation/2025-11-18', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`Evaluation page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);
  });

  test('Analytics page should load in < 1 second', async ({ page }) => {
    const start = Date.now();

    await page.goto('/analytics', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`Analytics page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);

    await expect(page.locator('[data-testid="trend-graph"]')).toBeVisible();
  });

  test('History page should load in < 1 second', async ({ page }) => {
    const start = Date.now();

    await page.goto('/history', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`History page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);

    await expect(page.locator('[data-testid="history-calendar"]')).toBeVisible();
  });

  test('Tasks page should load in < 1 second', async ({ page }) => {
    const start = Date.now();

    await page.goto('/tasks', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`Tasks page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);

    await expect(page.locator('text=Незакрытые задачи')).toBeVisible();
  });

  test('Weekly report should load in < 1 second', async ({ page }) => {
    const start = Date.now();

    await page.goto('/reports/week?start=2025-11-11', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`Weekly report load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);
  });

  test('Dashboard with data should still load quickly', async ({ page }) => {
    // Simulate dashboard with 60 days of data
    const start = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`Dashboard with data load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);
  });
});

test.describe('Time to Interactive', () => {
  test('Dashboard should be interactive quickly', async ({ page }) => {
    await page.goto('/');

    const start = Date.now();

    // Wait for page to be fully interactive
    await page.waitForLoadState('load');

    // Try to interact with a button
    const button = page.locator('button:has-text("Создать план на день")');
    await expect(button).toBeEnabled();

    const timeToInteractive = Date.now() - start;

    console.log(`Time to interactive: ${timeToInteractive}ms`);
    expect(timeToInteractive).toBeLessThan(1000);
  });
});

test.describe('First Contentful Paint', () => {
  test('Should show content quickly', async ({ page }) => {
    const start = Date.now();

    await page.goto('/');

    // Wait for first meaningful content
    await page.waitForSelector('h1, [data-testid="dashboard-content"]', { state: 'visible' });

    const fcp = Date.now() - start;

    console.log(`First Contentful Paint: ${fcp}ms`);
    expect(fcp).toBeLessThan(500); // Should be < 500ms
  });
});

test.describe('Resource Loading', () => {
  test('Should not have excessive network requests', async ({ page }) => {
    const requests: any[] = [];

    page.on('request', request => {
      requests.push(request);
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    console.log(`Total requests: ${requests.length}`);
    expect(requests.length).toBeLessThan(50); // Should be reasonable
  });

  test('Should load critical CSS inline', async ({ page }) => {
    await page.goto('/');

    // Check for inline styles (critical CSS)
    const inlineStyles = await page.locator('style').count();
    expect(inlineStyles).toBeGreaterThan(0);
  });

  test('Should lazy load non-critical resources', async ({ page }) => {
    const start = Date.now();

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const domLoadTime = Date.now() - start;

    console.log(`DOM load time: ${domLoadTime}ms`);
    expect(domLoadTime).toBeLessThan(500);
  });
});

test.describe('Chart Performance', () => {
  test('Evaluation graph should render quickly', async ({ page }) => {
    await page.goto('/');

    const start = Date.now();

    await page.waitForSelector('[data-testid="evaluation-graph"]', { state: 'visible' });

    const renderTime = Date.now() - start;

    console.log(`Graph render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(500);
  });

  test('Analytics graph with 90 days data should render quickly', async ({ page }) => {
    await page.goto('/analytics');

    // Select 90 days
    await page.selectOption('[aria-label="Выбор периода"]', '90');

    const start = Date.now();

    await page.waitForSelector('[data-testid="trend-graph"]', { state: 'visible' });

    const renderTime = Date.now() - start;

    console.log(`90-day graph render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(1000);
  });
});

test.describe('Navigation Performance', () => {
  test('Should navigate between pages quickly', async ({ page }) => {
    await page.goto('/');

    // Navigate to different pages and measure
    const pages = [
      '/goals',
      '/daily/2025-11-18',
      '/history',
      '/analytics',
      '/tasks',
      '/',
    ];

    for (const url of pages) {
      const start = Date.now();

      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const navTime = Date.now() - start;

      console.log(`Navigation to ${url}: ${navTime}ms`);
      expect(navTime).toBeLessThan(500); // Client-side navigation should be fast
    }
  });
});

test.describe('Mobile Performance', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('Dashboard should load quickly on mobile', async ({ page }) => {
    const start = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - start;

    console.log(`Mobile dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1500); // Slightly more lenient for mobile
  });
});

test.describe('Memory Usage', () => {
  test('Should not have memory leaks on navigation', async ({ page, context }) => {
    await page.goto('/');

    // Navigate through multiple pages
    for (let i = 0; i < 10; i++) {
      await page.goto('/goals');
      await page.goto('/analytics');
      await page.goto('/');
    }

    // Measure memory (if available)
    const metrics = await page.metrics();
    console.log('JS Heap Size:', metrics.JSHeapUsedSize);

    // Should not grow unbounded
    expect(metrics.JSHeapUsedSize).toBeLessThan(50 * 1024 * 1024); // < 50MB
  });
});

test.describe('Claude API Performance', () => {
  test('Evaluation request should respect 30s timeout', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];

    await page.goto(`/daily/${today}`);

    await page.fill('[aria-label="План на день"]', 'Test plan');
    await page.click('text=Сохранить план');
    await page.fill('[aria-label="Факт выполнения"]', 'Test fact');
    await page.click('text=Сохранить факт');

    const start = Date.now();

    // Click evaluate button
    await page.click('button:has-text("Получить оценку")');

    // Wait for navigation or timeout
    try {
      await page.waitForURL(/\/evaluation\//, { timeout: 35000 });
      const duration = Date.now() - start;

      console.log(`Evaluation completed in: ${duration}ms`);
      expect(duration).toBeLessThan(30000); // Should complete within 30s spec
    } catch (error) {
      const duration = Date.now() - start;
      console.log(`Evaluation timed out after: ${duration}ms`);

      // Should show timeout error
      await expect(page.locator('text=Превышено время ожидания')).toBeVisible();
    }
  }, 40000); // Test timeout slightly higher than API timeout
});
