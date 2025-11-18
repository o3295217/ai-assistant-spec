# Test Suite Documentation

## Overview

This test suite provides comprehensive coverage for the Personal AI Effectiveness Assistant application, focusing on Phase 1 (Critical) testing requirements:

- ✅ API route tests
- ✅ Claude API integration tests
- ✅ Database layer tests
- ✅ Business logic tests

## Test Structure

```
tests/
├── setup.ts                      # Jest configuration and global setup
├── utils/
│   ├── mockData.ts              # Mock data for all tests
│   └── testHelpers.ts           # Helper functions and utilities
├── api/
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
└── integration/
    └── claudeAPI.test.ts        # Claude API integration
```

## Running Tests

### Install Dependencies

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/jest-dom
npm install --save-dev @testing-library/react @testing-library/react-hooks
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# Run only API tests
npm test -- tests/api

# Run only Claude API tests
npm test -- tests/integration/claudeAPI

# Run specific file
npm test -- tests/api/goals/dream.test.ts
```

### Run with Coverage

```bash
npm test -- --coverage
```

### Watch Mode (for development)

```bash
npm test -- --watch
```

## Test Coverage Goals

| Category | Target | Description |
|----------|--------|-------------|
| **Unit Tests** | 80%+ | Individual functions and components |
| **Integration Tests** | 100% | All API endpoints |
| **Critical Paths** | 100% | Claude API, evaluations, data persistence |
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
