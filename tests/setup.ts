/**
 * Jest Test Setup File
 * Runs before each test suite
 */

import '@testing-library/jest-dom';

// Mock environment variables
process.env.DATABASE_URL = 'file:./test.db';
process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-mock';

// Global test timeout (30s for Claude API tests)
jest.setTimeout(30000);

// Suppress console errors in tests (optional)
// global.console = {
//   ...console,
//   error: jest.fn(),
// };
