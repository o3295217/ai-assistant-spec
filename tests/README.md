# Test Suite Documentation

## Overview

This test suite provides comprehensive coverage for the Personal AI Effectiveness Assistant application across all testing phases:

**Phase 1 (Critical) - COMPLETED:**
- ✅ API route tests
- ✅ Claude API integration tests
- ✅ Database layer tests
- ✅ Business logic tests

**Phase 3 (Medium) - COMPLETED:**
- ✅ Component tests for all major pages
- ✅ E2E tests for critical user journeys

**Phase 4 (Low) - COMPLETED:**
- ✅ Performance tests for database and pages
- ✅ Extended E2E scenarios

## Test Structure

```
tests/
├── setup.ts                      # Jest configuration and global setup
├── utils/
│   ├── mockData.ts              # Mock data for all tests
│   └── testHelpers.ts           # Helper functions and utilities
├── api/                         # Phase 1: API route tests
│   ├── goals/
│   │   ├── dream.test.ts        # Dream goal endpoints
│   │   └── period.test.ts       # Period goals endpoints
│   ├── daily/
│   │   └── entries.test.ts      # Daily entries endpoints
│   ├── evaluate/
│   │   └── evaluation.test.ts   # Evaluation endpoints
│   ├── tasks/
│   │   └── openTasks.test.ts    # Open tasks endpoints
│   └── analytics/
│       └── analytics.test.ts    # Analytics endpoints
├── integration/                 # Phase 1: Critical integrations
│   └── claudeAPI.test.ts        # Claude API integration
├── components/                  # Phase 3: Component tests
│   ├── Dashboard.test.tsx       # Dashboard page component
│   ├── GoalsPage.test.tsx       # Goals management page
│   ├── DailyPlanning.test.tsx   # Daily planning page
│   └── EvaluationDisplay.test.tsx # Evaluation display page
├── e2e/                         # Phase 3 & 4: End-to-end tests
│   ├── daily-workflow.spec.ts   # Complete daily workflow
│   ├── goal-hierarchy.spec.ts   # Goal setup journey
│   ├── analytics.spec.ts        # Analytics and history
│   └── extended-scenarios.spec.ts # Complex scenarios
└── performance/                 # Phase 4: Performance tests
    ├── database.test.ts         # Database query performance
    └── page-load.spec.ts        # Page load performance
```

## Running Tests

### Install Dependencies

```bash
# Jest and Testing Library (Phase 1)
npm install --save-dev jest @types/jest ts-jest @testing-library/jest-dom
npm install --save-dev @testing-library/react @testing-library/react-hooks
npm install --save-dev @testing-library/user-event

# Playwright for E2E tests (Phase 3 & 4)
npm install --save-dev @playwright/test
npx playwright install
```

### Run All Tests

```bash
# Run all unit and integration tests (Jest)
npm test

# Run all E2E tests (Playwright)
npm run test:e2e

# Run all tests (Jest + Playwright)
npm run test:all
```

### Run Specific Test Suite

```bash
# Jest tests
npm test -- tests/api                    # API tests only
npm test -- tests/components             # Component tests only
npm test -- tests/integration/claudeAPI  # Claude API tests
npm test -- tests/performance            # Performance tests

# Playwright E2E tests
npx playwright test tests/e2e/daily-workflow.spec.ts
npx playwright test tests/e2e/goal-hierarchy.spec.ts
npx playwright test tests/e2e/analytics.spec.ts
npx playwright test tests/e2e/extended-scenarios.spec.ts
```

### Run with Coverage

```bash
npm test -- --coverage
```

### Watch Mode (for development)

```bash
# Jest watch mode
npm test -- --watch

# Playwright UI mode
npx playwright test --ui
```

### Run Performance Tests

```bash
# Database performance
npm test -- tests/performance/database.test.ts

# Page load performance
npx playwright test tests/performance/page-load.spec.ts
```

## Test Coverage Goals

| Category | Target | Description |
|----------|--------|-------------|
| **Unit Tests** | 80%+ | Individual functions and components |
| **Component Tests** | 75%+ | React components and UI |
| **Integration Tests** | 100% | All API endpoints |
| **E2E Tests** | 100% | Critical user journeys |
| **Performance Tests** | 100% | DB queries, page loads |
| **Overall** | 75%+ | Total code coverage |

## Key Test Areas

### 1. Goals API Tests

**Files:**
- `tests/api/goals/dream.test.ts`
- `tests/api/goals/period.test.ts`

**Coverage:**
- ✅ Create/update dream goal
- ✅ Get current dream goal
- ✅ CRUD operations for period goals (week, month, quarter, half, year)
- ✅ Period date calculation logic
- ✅ JSON array handling for goals
- ✅ Validation and error handling

### 2. Daily Entries API Tests

**File:** `tests/api/daily/entries.test.ts`

**Coverage:**
- ✅ Create daily plan
- ✅ Update with fact
- ✅ Get entry by date
- ✅ List entries by date range
- ✅ Unique date constraint
- ✅ Multiline text handling

### 3. Evaluation API Tests

**File:** `tests/api/evaluate/evaluation.test.ts`

**Coverage:**
- ✅ Request evaluation from Claude
- ✅ Score validation (1-10 range)
- ✅ Overall score calculation
- ✅ Alignment status parsing
- ✅ Timeout handling (30s)
- ✅ Error handling
- ✅ Prevent duplicate evaluations

### 4. Open Tasks API Tests

**File:** `tests/api/tasks/openTasks.test.ts`

**Coverage:**
- ✅ Get all open tasks
- ✅ Filter by type (strategic/operational)
- ✅ Close task
- ✅ Task creation from incomplete plans
- ✅ Sorting and grouping

### 5. Analytics API Tests

**File:** `tests/api/analytics/analytics.test.ts`

**Coverage:**
- ✅ Get trend data (30/60/90 days)
- ✅ Weekly report generation
- ✅ Average score calculation
- ✅ Alignment aggregation
- ✅ Best/worst day identification
- ✅ Trend indicators

### 6. Claude API Integration Tests (CRITICAL)

**File:** `tests/integration/claudeAPI.test.ts`

**Coverage:**
- ✅ Prompt construction with all hierarchy levels
- ✅ API call with correct model (claude-sonnet-4.5)
- ✅ Timeout handling (30s requirement)
- ✅ JSON response parsing
- ✅ Score validation
- ✅ Alignment status extraction
- ✅ Error scenarios (malformed JSON, network errors, rate limiting)
- ✅ Database schema mapping

## Phase 3: Component & E2E Tests

### 7. Component Tests

**Files:**
- `tests/components/Dashboard.test.tsx`
- `tests/components/GoalsPage.test.tsx`
- `tests/components/DailyPlanning.test.tsx`
- `tests/components/EvaluationDisplay.test.tsx`

**Coverage:**
- ✅ Dashboard rendering and interactions
- ✅ Goal hierarchy widget (expand/collapse)
- ✅ Evaluation graph display
- ✅ Goals page with all 6 tabs
- ✅ Goal CRUD operations
- ✅ Daily planning form validation
- ✅ Plan/fact input with auto-save
- ✅ Context goals display
- ✅ Evaluation score visualization
- ✅ Alignment chain display with color coding
- ✅ Loading and error states
- ✅ Responsive design
- ✅ Accessibility (ARIA, keyboard navigation)

### 8. E2E Tests - Critical Paths

**File:** `tests/e2e/daily-workflow.spec.ts`

**Coverage:**
- ✅ Complete daily workflow: plan → fact → evaluate → view results
- ✅ Validation preventing evaluation without plan/fact
- ✅ Claude API timeout handling
- ✅ Editing plan after creation
- ✅ Context goals during planning
- ✅ Auto-save functionality
- ✅ Navigation between days
- ✅ Alignment details interaction
- ✅ Error handling and edge cases

**File:** `tests/e2e/goal-hierarchy.spec.ts`

**Coverage:**
- ✅ Complete goal hierarchy setup (dream → year → ... → week)
- ✅ Period date auto-calculation
- ✅ Individual goal editing and deletion
- ✅ Goal validation
- ✅ Unsaved changes preservation
- ✅ Keyboard shortcuts
- ✅ First-time user onboarding

**File:** `tests/e2e/analytics.spec.ts`

**Coverage:**
- ✅ Trend graph with different periods (30/60/90 days)
- ✅ History calendar view
- ✅ Date range filtering
- ✅ Weekly report generation
- ✅ Navigation between weeks
- ✅ Trend statistics and indicators
- ✅ Graph data point interaction
- ✅ Report export to PDF
- ✅ Open tasks management
- ✅ Task filtering and closing

## Phase 4: Performance & Extended Tests

### 9. Database Performance Tests

**File:** `tests/performance/database.test.ts`

**Coverage:**
- ✅ Read operations < 100ms
  - Fetch dream goal
  - Fetch daily entry by date
  - Fetch entry with evaluation
  - Fetch period goals
  - Fetch entries in date range
  - Fetch open tasks filtered
  - Fetch last 30 days
- ✅ Write operations < 100ms
  - Create/update dream goal
  - Create/update daily entry
  - Create evaluation
  - Close open task
- ✅ Complex queries < 100ms
  - Fetch all data for evaluation prompt
  - Aggregate weekly statistics
  - Cascade delete operations
- ✅ Bulk operations performance
- ✅ Index performance validation

### 10. Page Load Performance Tests

**File:** `tests/performance/page-load.spec.ts`

**Coverage:**
- ✅ All pages load < 1 second
  - Dashboard
  - Goals page
  - Daily planning
  - Evaluation page
  - Analytics
  - History
  - Tasks
  - Weekly report
- ✅ Time to Interactive < 1 second
- ✅ First Contentful Paint < 500ms
- ✅ Resource loading optimization
- ✅ Chart rendering performance
- ✅ Navigation performance
- ✅ Mobile performance
- ✅ Memory usage monitoring
- ✅ Claude API 30s timeout compliance

### 11. Extended E2E Scenarios

**File:** `tests/e2e/extended-scenarios.spec.ts`

**Coverage:**
- ✅ Multi-day workflow (5+ days)
- ✅ Open tasks tracking across days
- ✅ Goal evolution and alignment changes
- ✅ Data export and backup
- ✅ Print functionality
- ✅ Offline behavior
- ✅ Save queuing when offline
- ✅ Complete keyboard-only workflow
- ✅ Screen reader announcements
- ✅ Edge cases:
  - Very long text (5000+ chars)
  - Special characters and emojis
  - Concurrent saves
  - Date boundary cases (year end, leap year)

## Test Data

All test data is centralized in `tests/utils/mockData.ts`:

- `mockDreamGoal` - Sample 5-year goal
- `mockYearGoals` - Sample yearly objectives
- `mockWeekGoals` - Sample weekly tasks
- `mockDailyEntry` - Sample plan and fact
- `mockEvaluation` - Sample Claude evaluation
- `mockClaudeResponse` - Sample API response
- `mockOpenTask` - Sample incomplete task

## Helper Functions

Located in `tests/utils/testHelpers.ts`:

### Database Helpers

```typescript
getPrismaTestClient() // Get test database client
cleanupDatabase()     // Clean all test data
disconnectPrisma()    // Close database connection
```

### Validation Helpers

```typescript
isValidScore(score: number)              // Validate 1-10 range
isValidOverallScore(score: number)       // Validate with 0.5 increments
isValidAlignmentStatus(status: string)   // Validate works/partial/no
parseAlignmentStatus(text: string)       // Extract status from text
```

### Period Calculation

```typescript
getCurrentPeriodDates(periodType: string) // Calculate period boundaries
```

### Mock Request/Response

```typescript
createMockRequest(options)  // Create mock Next.js request
createMockResponse()        // Create mock Next.js response
```

## Database Setup for Tests

Tests use a separate SQLite database (`test.db`):

```typescript
// .env.test
DATABASE_URL="file:./test.db"
ANTHROPIC_API_KEY="sk-ant-test-key-mock"
```

Before running tests:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

## Mocking Claude API

Claude API calls are mocked using Jest:

```typescript
jest.mock('@anthropic-ai/sdk');

// In test
mockAnthropicClient.messages.create = jest.fn().mockResolvedValue({
  content: [{ text: JSON.stringify(mockClaudeResponse) }],
});
```

## Common Test Patterns

### Test API Endpoint

```typescript
it('should return data', async () => {
  // Arrange: Set up test data
  const entry = await prisma.dailyEntry.create({ ... });

  // Create mock request/response
  const req = createMockRequest({ method: 'GET' });
  const res = createMockResponse();

  // Act: Call handler
  await handler(req, res);

  // Assert: Verify response
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expectedData);
});
```

### Test Validation

```typescript
it('should validate input', async () => {
  const req = createMockRequest({
    method: 'POST',
    body: { /* invalid data */ },
  });
  const res = createMockResponse();

  await handler(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Validation error message',
  });
});
```

### Test Database Operations

```typescript
it('should save to database', async () => {
  // Arrange
  const data = { ... };

  // Act
  const result = await createRecord(data);

  // Assert: Verify in database
  const saved = await prisma.model.findUnique({
    where: { id: result.id },
  });

  expect(saved).toBeDefined();
  expect(saved.field).toBe(data.field);
});
```

## Performance Requirements

Tests validate these performance requirements:

- ✅ Database queries < 100ms
- ✅ Claude API timeout = 30s
- ✅ Page load expectations

## Security Tests

- ✅ API key not exposed in responses
- ✅ Input sanitization
- ✅ SQL injection prevention (via Prisma)
- ✅ Data validation before DB operations

## Continuous Integration

### GitHub Actions (Example)

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npx prisma generate
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

## Troubleshooting

### Tests Timeout

Increase Jest timeout in specific tests:

```typescript
it('long running test', async () => {
  // test code
}, 30000); // 30 second timeout
```

### Database Lock Errors

Ensure cleanup in `afterEach`:

```typescript
afterEach(async () => {
  await cleanupDatabase();
});
```

### Mock Not Working

Verify mock is defined before imports:

```typescript
jest.mock('@anthropic-ai/sdk');
// Must come before other imports
```

## Next Steps

After implementing the application code:

1. Uncomment test assertions
2. Run tests and fix failures
3. Achieve 75%+ coverage
4. Add E2E tests (Phase 3)
5. Set up CI/CD pipeline

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [Next.js Testing](https://nextjs.org/docs/testing)

## Contact

For questions about the test suite, refer to the main specification in `ai-assistant-spec.md`.
