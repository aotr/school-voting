# Testing Documentation & QA Guide
## School Voting System - Desktop Edition

**Version:** 1.0.0  
**Date:** May 2026  
**Classification:** Testing & QA Reference  

---

## Table of Contents
1. [Testing Strategy](#testing-strategy)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [E2E Testing](#e2e-testing)
5. [Manual Testing](#manual-testing)
6. [Performance Testing](#performance-testing)
7. [Accessibility Testing](#accessibility-testing)

---

## Testing Strategy

### Testing Pyramid

```
               △
              /  \      Manual Tests (10%)
             /    \     Exploratory, UAT
            /______\
           /        \   E2E Tests (20%)
          /          \ Integration
         /____________\
        /              \  Unit Tests (70%)
       /                \ Component
      /________________\
```

### Test Coverage Goals

| Layer | Type | Coverage | Tool |
|-------|------|----------|------|
| Unit | JavaScript logic | 80%+ | Jest |
| Integration | API endpoints | 70%+ | Jest + Supertest |
| E2E | User workflows | 90% critical | Playwright |
| Manual | UI/UX, edge cases | 100% critical | Manual |

### Test Environment Requirements

**Development Machine:**
```
Node.js: 14.x+
npm: 6.x+
SQLite3: 3.x
Electron: 27.x
Browser: Chromium (Playwright)
```

**Test Data:**
- Clean database on each test
- Sample candidates (8 default)
- Reset votes before each test
- Admin user password: admin123

### Test Execution Plan

**Per Commit:**
- Unit tests pass
- Linting passes
- No console errors

**Pre-Release:**
- Full unit test suite
- All integration tests
- Critical E2E tests
- Manual smoke tests
- Performance benchmarks

**Release Candidate:**
- Full E2E test suite
- Accessibility audit
- Security audit
- Performance validation
- UAT with stakeholders

---

## Unit Testing

### Testing Framework & Setup

**Jest Configuration (jest.config.js):**
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.spec.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['**/*.js', '!**/__tests__/**', '!dist/**'],
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 70, statements: 70 }
  }
};
```

### Unit Test Examples

#### Test: Vote Recording Logic

```javascript
// tests/db.test.js
const { VotingStore } = require('../db-direct');
const Database = require('better-sqlite3');

describe('VotingStore - Vote Recording', () => {
  let db;

  beforeEach(() => {
    // Create fresh in-memory database for each test
    db = new Database(':memory:');
    // Initialize schema...
  });

  afterEach(() => {
    db.close();
  });

  test('should record vote successfully', () => {
    // Arrange
    const candidateId = 1;
    
    // Act
    const result = VotingStore.recordVote(candidateId);
    
    // Assert
    expect(result).toBe(true);
    
    const voteCount = db.prepare(
      'SELECT vote_count FROM candidates WHERE id = ?'
    ).get(candidateId);
    
    expect(voteCount.vote_count).toBe(1);
  });

  test('should reject invalid candidate', () => {
    // Arrange
    const invalidId = 9999;
    
    // Act & Assert
    expect(() => {
      VotingStore.recordVote(invalidId);
    }).toThrow('Candidate not found');
  });

  test('should increment vote count', () => {
    // Test vote count increments correctly
    VotingStore.recordVote(1);
    VotingStore.recordVote(1);
    VotingStore.recordVote(1);
    
    const count = db.prepare(
      'SELECT COUNT(*) as c FROM votes WHERE candidate_id = 1'
    ).get();
    
    expect(count.c).toBe(3);
  });

  test('should create vote record with timestamp', () => {
    const before = new Date();
    VotingStore.recordVote(1);
    const after = new Date();
    
    const vote = db.prepare(
      'SELECT voted_at FROM votes WHERE candidate_id = 1'
    ).get();
    
    const voteTime = new Date(vote.voted_at);
    expect(voteTime >= before && voteTime <= after).toBe(true);
  });
});
```

#### Test: Authentication

```javascript
// tests/auth.test.js
const { verifyAdminPassword } = require('../db-direct');
const bcrypt = require('bcryptjs');

describe('Admin Authentication', () => {
  test('should verify correct password', async () => {
    const password = 'admin123';
    const result = verifyAdminPassword(password);
    expect(result).toBe(true);
  });

  test('should reject incorrect password', async () => {
    const result = verifyAdminPassword('wrongpassword');
    expect(result).toBe(false);
  });

  test('should handle empty password', async () => {
    const result = verifyAdminPassword('');
    expect(result).toBe(false);
  });

  test('should handle null password', async () => {
    const result = verifyAdminPassword(null);
    expect(result).toBe(false);
  });
});
```

#### Test: Candidate Management

```javascript
// tests/candidates.test.js
describe('Candidate Management', () => {
  test('should add candidate', () => {
    const candidate = {
      electionId: 1,
      code: 'test-candidate',
      name: 'Test Candidate',
      tagline: 'Test Symbol',
      symbolPath: 'assets/symbols/test.svg'
    };
    
    const result = VotingStore.addCandidate(candidate);
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Test Candidate');
  });

  test('should not allow duplicate candidate code', () => {
    const candidate = {
      electionId: 1,
      code: 'duplicate',
      name: 'First',
      tagline: 'Test',
      symbolPath: 'assets/symbols/test.svg'
    };
    
    VotingStore.addCandidate(candidate);
    
    expect(() => {
      VotingStore.addCandidate(candidate);
    }).toThrow('Duplicate candidate code');
  });

  test('should update candidate', () => {
    const updated = VotingStore.updateCandidate(1, {
      name: 'Updated Name'
    });
    
    expect(updated.name).toBe('Updated Name');
  });

  test('should delete candidate', () => {
    const deleted = VotingStore.deleteCandidate(1);
    expect(deleted).toBe(true);
    
    const candidate = db.prepare(
      'SELECT * FROM candidates WHERE id = 1'
    ).get();
    
    expect(candidate).toBeUndefined();
  });
});
```

### Running Unit Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/db.test.js

# Run with coverage
npm test -- --coverage

# Watch mode (re-run on file change)
npm test -- --watch

# Verbose output
npm test -- --verbose

# Coverage threshold check
npm test -- --coverage --bail
```

### Coverage Report

```
---------|----------|----------|----------|----------|------|
File     | % Stmts  | % Branch | % Funcs  | % Lines  | Unc.  |
---------|----------|----------|----------|----------|------|
All      |   78.45  |   71.23  |   82.10  |   78.45  |      |
---------|----------|----------|----------|----------|------|
db.js    |   89.50  |   85.00  |   90.00  |   89.50  |      |
app.js   |   65.30  |   58.00  |   70.00  |   65.30  |      |
server.js|   82.10  |   75.00  |   85.00  |   82.10  |      |
---------|----------|----------|----------|----------|------|
```

---

## Integration Testing

### API Integration Tests

```javascript
// tests/api.integration.test.js
const request = require('supertest');
const app = require('../server');
const { initDatabase } = require('../db-direct');

describe('API Integration Tests', () => {
  beforeAll(() => {
    initDatabase();
  });

  describe('GET /api/election', () => {
    test('should return active election and candidates', async () => {
      const response = await request(app)
        .get('/api/election')
        .expect(200);
      
      expect(response.body).toHaveProperty('election');
      expect(response.body).toHaveProperty('candidates');
      expect(response.body).toHaveProperty('totalVotes');
      expect(Array.isArray(response.body.candidates)).toBe(true);
    });

    test('should return correct candidate count', async () => {
      const response = await request(app)
        .get('/api/election')
        .expect(200);
      
      expect(response.body.candidates.length).toBe(8); // Default count
    });
  });

  describe('POST /api/vote/:candidateId', () => {
    test('should record vote and return success', async () => {
      const response = await request(app)
        .post('/api/vote/1')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('recorded');
    });

    test('should increment total votes', async () => {
      const before = await request(app).get('/api/election');
      const beforeCount = before.body.totalVotes;
      
      await request(app).post('/api/vote/1');
      
      const after = await request(app).get('/api/election');
      expect(after.body.totalVotes).toBe(beforeCount + 1);
    });

    test('should reject invalid candidate', async () => {
      const response = await request(app)
        .post('/api/vote/9999')
        .expect(400);
      
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/admin/login', () => {
    test('should authenticate with correct password', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({ password: 'admin123' })
        .expect(200);
      
      expect(response.body.authenticated).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({ password: 'wrong' })
        .expect(401);
      
      expect(response.body.authenticated).toBe(false);
    });

    test('should create session cookie', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({ password: 'admin123' });
      
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('connect.sid');
    });
  });
});
```

---

## E2E Testing

### Playwright Test Configuration

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
```

### E2E Test Examples

#### Test: Complete Voting Flow

```typescript
// tests/e2e/voting.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Voting Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#candidate-list');
  });

  test('should display election and candidates', async ({ page }) => {
    const title = await page.locator('#election-title').textContent();
    expect(title).toContain('School Election');

    const candidates = await page.locator('.candidate-row');
    expect(await candidates.count()).toBeGreaterThan(0);
  });

  test('should record vote successfully', async ({ page }) => {
    const firstButton = await page.locator('.vote-button').first();
    const candidateName = await page
      .locator('.candidate-name')
      .first()
      .textContent();

    await firstButton.click();

    const message = page.locator('#message-box');
    await expect(message).toContainText('recorded successfully');
  });

  test('should disable vote button after voting', async ({ page }) => {
    const firstButton = await page.locator('.vote-button').first();
    
    await firstButton.click();
    await expect(firstButton).toBeDisabled();
  });

  test('should update vote count', async ({ page }) => {
    const beforeCount = await page
      .locator('#total-votes')
      .textContent();
    const before = parseInt(beforeCount || '0');

    await page.locator('.vote-button').first().click();
    await page.waitForTimeout(500);

    const afterCount = await page
      .locator('#total-votes')
      .textContent();
    const after = parseInt(afterCount || '0');

    expect(after).toBe(before + 1);
  });

  test('should handle rapid votes', async ({ page }) => {
    const buttons = await page.locator('.vote-button');
    const count = await buttons.count();

    // Vote for different candidates
    for (let i = 0; i < Math.min(3, count); i++) {
      const button = buttons.nth(i);
      await button.click();
      await page.waitForTimeout(200);
    }

    const message = page.locator('#message-box');
    const text = await message.textContent();
    expect(text).toContain('success');
  });
});
```

#### Test: Admin Panel

```typescript
// tests/e2e/admin.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test('should login with correct password', async ({ page }) => {
    await page.goto('/admin.html');
    
    const passwordInput = page.locator('#admin-password');
    const submitButton = page.locator('#login-form button[type="submit"]');

    await passwordInput.fill('admin123');
    await submitButton.click();

    await expect(page.locator('#admin-dashboard')).toBeVisible({
      timeout: 5000
    });
  });

  test('should reject incorrect password', async ({ page }) => {
    await page.goto('/admin.html');
    
    const passwordInput = page.locator('#admin-password');
    const submitButton = page.locator('#login-form button[type="submit"]');

    await passwordInput.fill('wrongpassword');
    await submitButton.click();

    const message = page.locator('#login-message');
    await expect(message).toContainText('Incorrect password');
  });

  test('should display voting results', async ({ page }) => {
    // Login first
    await page.goto('/admin.html');
    await page.locator('#admin-password').fill('admin123');
    await page.locator('#login-form button[type="submit"]').click();

    // Navigate to results
    await page.click('text=Results');
    
    // Verify results displayed
    const results = page.locator('[data-test="result-row"]');
    expect(await results.count()).toBeGreaterThan(0);
  });

  test('should allow closing voting', async ({ page }) => {
    // Login
    await page.goto('/admin.html');
    await page.locator('#admin-password').fill('admin123');
    await page.locator('#login-form button[type="submit"]').click();

    // Go to election settings
    await page.click('text=Election');
    
    // Click close voting
    await page.click('button:has-text("Close Voting")');
    
    // Verify voting is closed
    const status = page.locator('[data-test="voting-status"]');
    await expect(status).toContainText('Closed');
  });

  test('should allow resetting votes', async ({ page }) => {
    // Login and navigate to results
    await page.goto('/admin.html');
    await page.locator('#admin-password').fill('admin123');
    await page.locator('#login-form button[type="submit"]').click();

    await page.click('text=Results');
    
    // Click reset
    const resetButton = page.locator('button:has-text("Reset Votes")');
    await resetButton.click();
    
    // Confirm
    await page.click('button:has-text("Confirm Reset")');
    
    // Verify votes cleared
    const totalVotes = page.locator('[data-test="total-votes"]');
    await expect(totalVotes).toContainText('0');
  });
});
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/voting.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in specific browser
npx playwright test --project=chromium

# Generate and open report
npx playwright test && npx playwright show-report

# Debug mode
npx playwright test --debug

# Slow motion (visualize each action)
npx playwright test --headed --slow-mo=1000
```

---

## Manual Testing

### Smoke Test Checklist

**Pre-Voting Setup:**
- [ ] Application launches without error
- [ ] Database initializes
- [ ] Candidates display with symbols
- [ ] Admin panel accessible
- [ ] Can login with admin123
- [ ] Can change password
- [ ] Can edit candidates

**Voting Interface:**
- [ ] All candidates visible
- [ ] Symbols load correctly
- [ ] Vote buttons responsive
- [ ] Success message appears after vote
- [ ] Vote counter updates
- [ ] Vote button disabled after voting
- [ ] Time display updates

**Admin Functions:**
- [ ] Can open/close voting
- [ ] Results display correctly
- [ ] Results update in real-time
- [ ] Can reset votes
- [ ] Can export data
- [ ] Can change password
- [ ] Session expires after 1 hour

**Cross-Browser Testing:**
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari (macOS)
- [ ] Works in Edge

**Accessibility Testing:**
- [ ] All buttons keyboard accessible
- [ ] Tab navigation works
- [ ] Screen reader friendly (ARIA labels)
- [ ] Color contrast sufficient
- [ ] Text resizable

### Test Case Template

```
Test Case ID: VC-001
Title: User votes for candidate successfully

Preconditions:
  - Application running
  - Voting interface displayed
  - At least 1 candidate available
  - Voting is open

Steps:
  1. User views candidate list
  2. User clicks "Vote" button next to first candidate
  3. Wait 1 second
  4. Observe message box

Expected Result:
  - Success message "Your vote has been recorded successfully"
  - Message displays for 3 seconds
  - Vote counter increases
  - Vote button becomes disabled

Actual Result:
  [Fill during test]

Status: Pass/Fail
  
Notes:
  [Any observations]
```

### Manual Test Scenarios

**Scenario 1: Normal Voting Session**
1. Start application
2. View all 8 candidates
3. Vote for candidate 1 (Tuhina Khatun)
4. Verify success message
5. Verify vote button disabled
6. Restart application
7. Verify vote button still disabled (one vote only)
8. Expected: Only 1 vote recorded

**Scenario 2: Admin Election Management**
1. Open admin panel
2. Login with admin123
3. Change password to NewPassword123
4. Logout
5. Try to login with admin123 (should fail)
6. Login with NewPassword123 (should succeed)
7. Go to Candidates tab
8. Add new candidate "Test Candidate"
9. Edit "Test Candidate" name to "Updated Candidate"
10. Delete "Updated Candidate"
11. Expected: Candidate manageable

**Scenario 3: Results Tracking**
1. Vote as 3 different voters
2. Each voter votes for different candidates
3. Open admin panel
4. Go to Results tab
5. Verify vote counts correct
6. Verify ranking correct
7. Export data
8. Expected: Results match votes

**Scenario 4: Error Handling**
1. Delete database file manually
2. Start application
3. Verify it recreates database
4. Try to vote
5. Expected: Application recovers gracefully

---

## Performance Testing

### Load Testing

```javascript
// tests/performance/load.test.js
const http = require('http');

async function loadTest(url, requests = 100, concurrent = 10) {
  const results = {
    success: 0,
    failed: 0,
    times: [],
    errors: []
  };

  for (let i = 0; i < requests; i += concurrent) {
    const batch = [];
    
    for (let j = 0; j < concurrent && i + j < requests; j++) {
      batch.push(
        new Promise(resolve => {
          const start = Date.now();
          
          http.get(url, (res) => {
            const time = Date.now() - start;
            results.times.push(time);
            
            if (res.statusCode === 200) {
              results.success++;
            } else {
              results.failed++;
            }
            
            resolve();
          }).on('error', (e) => {
            results.failed++;
            results.errors.push(e.message);
            resolve();
          });
        })
      );
    }
    
    await Promise.all(batch);
  }

  // Calculate statistics
  results.avgTime = results.times.reduce((a, b) => a + b, 0) / results.times.length;
  results.maxTime = Math.max(...results.times);
  results.minTime = Math.min(...results.times);
  
  return results;
}

// Run test
loadTest('http://localhost:3000/api/election', 100, 10)
  .then(results => {
    console.log('Load Test Results:');
    console.log(`Successful: ${results.success}/100`);
    console.log(`Failed: ${results.failed}/100`);
    console.log(`Avg Response: ${results.avgTime}ms`);
    console.log(`Max Response: ${results.maxTime}ms`);
    console.log(`Min Response: ${results.minTime}ms`);
  });
```

### Benchmarks

```javascript
// tests/performance/benchmark.js
const Benchmark = require('benchmark');
const { VotingStore } = require('../db-direct');

const suite = new Benchmark.Suite;

suite
  .add('Record Vote', () => {
    VotingStore.recordVote(1);
  })
  .add('Load Voting State', () => {
    VotingStore.loadVotingState();
  })
  .add('Get Results', () => {
    VotingStore.getResults();
  })
  .on('complete', function() {
    console.log('Benchmarks:');
    this.forEach(benchmark => {
      console.log(String(benchmark));
    });
  })
  .run({ 'async': true });
```

---

## Accessibility Testing

### WCAG 2.1 Checklist

- [ ] **Perceivable**: Content visible to all users
  - [ ] Color not sole means of conveying info
  - [ ] Text contrast ratio ≥ 4.5:1 for normal text
  - [ ] Images have alt text
  - [ ] Media has captions

- [ ] **Operable**: Users can navigate and use
  - [ ] All functionality available via keyboard
  - [ ] Focus indicators visible
  - [ ] No keyboard traps
  - [ ] No content that causes seizures

- [ ] **Understandable**: Content clear and understandable
  - [ ] Page language specified
  - [ ] Form labels present
  - [ ] Error messages helpful
  - [ ] Consistent navigation

- [ ] **Robust**: Works with assistive technologies
  - [ ] Valid HTML/ARIA
  - [ ] Proper semantic structure
  - [ ] ARIA labels where needed
  - [ ] Screen reader tested

### Automated Accessibility Testing

```bash
# Install axe DevTools
npm install --save-dev @axe-core/playwright

# Run tests
npx playwright test --project=a11y
```

---

## Document Info

**Version:** 1.0.0  
**Last Updated:** May 6, 2026  
**Classification:** Testing Reference  

