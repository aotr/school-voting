# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: voting.spec.ts >> Voting System E2E Tests >> should record a vote successfully
- Location: tests/e2e/voting.spec.ts:28:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.vote-button').first()
    - locator resolved to <button disabled type="button" class="vote-button" data-vote-button="533" aria-label="Vote for Tuhina Khatun">↵        Closed↵      </button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    58 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- main [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - img "School Logo" [ref=e6]
        - generic [ref=e7]:
          - paragraph [ref=e8]: School Election undefined
          - heading "School Election 2026" [level=1] [ref=e9]
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e12]: Mode
          - strong [ref=e13]: Voting Closed
        - generic [ref=e14]:
          - generic [ref=e15]: Session
          - strong [ref=e16]: 21:17:19
    - generic [ref=e17]: Press one round vote button only once.
    - generic [ref=e20]:
      - article [ref=e21]:
        - img "Tuhina Khatun symbol" [ref=e24]
        - generic [ref=e25]:
          - heading "Tuhina Khatun" [level=2] [ref=e26]
          - paragraph [ref=e27]: Clock
        - button "Vote for Tuhina Khatun" [disabled] [ref=e28]: Closed
      - article [ref=e29]:
        - img "Jenifer Mandi symbol" [ref=e32]
        - generic [ref=e33]:
          - heading "Jenifer Mandi" [level=2] [ref=e34]
          - paragraph [ref=e35]: Galaxy
        - button "Vote for Jenifer Mandi" [disabled] [ref=e36]: Closed
      - article [ref=e37]:
        - img "Sumitra Hansda symbol" [ref=e40]
        - generic [ref=e41]:
          - heading "Sumitra Hansda" [level=2] [ref=e42]
          - paragraph [ref=e43]: Butterfly
        - button "Vote for Sumitra Hansda" [disabled] [ref=e44]: Closed
      - article [ref=e45]:
        - img "Rilamala Murmu symbol" [ref=e48]
        - generic [ref=e49]:
          - heading "Rilamala Murmu" [level=2] [ref=e50]
          - paragraph [ref=e51]: Olive Leaf
        - button "Vote for Rilamala Murmu" [disabled] [ref=e52]: Closed
      - article [ref=e53]:
        - img "Anish Kujur symbol" [ref=e56]
        - generic [ref=e57]:
          - heading "Anish Kujur" [level=2] [ref=e58]
          - paragraph [ref=e59]: Trophy
        - button "Vote for Anish Kujur" [disabled] [ref=e60]: Closed
      - article [ref=e61]:
        - img "Devendra Sing symbol" [ref=e64]
        - generic [ref=e65]:
          - heading "Devendra Sing" [level=2] [ref=e66]
          - paragraph [ref=e67]: Tree
        - button "Vote for Devendra Sing" [disabled] [ref=e68]: Closed
      - article [ref=e69]:
        - img "Bikram Sing symbol" [ref=e72]
        - generic [ref=e73]:
          - heading "Bikram Sing" [level=2] [ref=e74]
          - paragraph [ref=e75]: Book
        - button "Vote for Bikram Sing" [disabled] [ref=e76]: Closed
      - article [ref=e77]:
        - img "Sunil Mandi symbol" [ref=e80]
        - generic [ref=e81]:
          - heading "Sunil Mandi" [level=2] [ref=e82]
          - paragraph [ref=e83]: Equality
        - button "Vote for Sunil Mandi" [disabled] [ref=e84]: Closed
      - article [ref=e85]:
        - img "Tuhina Khatun symbol" [ref=e88]
        - generic [ref=e89]:
          - heading "Tuhina Khatun" [level=2] [ref=e90]
          - paragraph [ref=e91]: Clock
        - button "Vote for Tuhina Khatun" [disabled] [ref=e92]: Closed
      - article [ref=e93]:
        - img "Jeanifer Mandi symbol" [ref=e96]
        - generic [ref=e97]:
          - heading "Jeanifer Mandi" [level=2] [ref=e98]
          - paragraph [ref=e99]: Galaxy
        - button "Vote for Jeanifer Mandi" [disabled] [ref=e100]: Closed
      - article [ref=e101]:
        - img "Sumitra Hansda symbol" [ref=e104]
        - generic [ref=e105]:
          - heading "Sumitra Hansda" [level=2] [ref=e106]
          - paragraph [ref=e107]: Butterfly
        - button "Vote for Sumitra Hansda" [disabled] [ref=e108]: Closed
      - article [ref=e109]:
        - img "Rilamala Murmu symbol" [ref=e112]
        - generic [ref=e113]:
          - heading "Rilamala Murmu" [level=2] [ref=e114]
          - paragraph [ref=e115]: Olive Leaf
        - button "Vote for Rilamala Murmu" [disabled] [ref=e116]: Closed
      - article [ref=e117]:
        - img "Anish Kujur symbol" [ref=e120]
        - generic [ref=e121]:
          - heading "Anish Kujur" [level=2] [ref=e122]
          - paragraph [ref=e123]: Trophy
        - button "Vote for Anish Kujur" [disabled] [ref=e124]: Closed
      - article [ref=e125]:
        - img "Devendra Sing symbol" [ref=e128]
        - generic [ref=e129]:
          - heading "Devendra Sing" [level=2] [ref=e130]
          - paragraph [ref=e131]: Tree
        - button "Vote for Devendra Sing" [disabled] [ref=e132]: Closed
      - article [ref=e133]:
        - img "Bikram Sing symbol" [ref=e136]
        - generic [ref=e137]:
          - heading "Bikram Sing" [level=2] [ref=e138]
          - paragraph [ref=e139]: Book
        - button "Vote for Bikram Sing" [disabled] [ref=e140]: Closed
      - article [ref=e141]:
        - img "Sunit Mandi symbol" [ref=e144]
        - generic [ref=e145]:
          - heading "Sunit Mandi" [level=2] [ref=e146]
          - paragraph [ref=e147]: Equality
        - button "Vote for Sunit Mandi" [disabled] [ref=e148]: Closed
    - generic [ref=e149]:
      - generic [ref=e150]: Voting is currently closed by the admin panel.
      - generic [ref=e151]:
        - generic [ref=e152]:
          - generic [ref=e153]: Voter Slip Box
          - generic [ref=e154]: Waiting For Vote
        - generic [ref=e155]:
          - generic [ref=e158]: Slip box empty
          - article [ref=e159]:
            - generic [ref=e161]:
              - generic [ref=e162]: Printed Vote
              - strong [ref=e163]: Ready
              - generic [ref=e164]: Awaiting selection
      - button "Reset For Next Student" [ref=e165] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Voting System E2E Tests', () => {
  4   |   const baseURL = 'http://localhost:3000';
  5   | 
  6   |   test.beforeEach(async ({ page }) => {
  7   |     // Navigate to the voting page
  8   |     await page.goto(baseURL);
  9   |     // Wait for the page to load
  10  |     await page.waitForSelector('#candidate-list', { timeout: 10000 });
  11  |   });
  12  | 
  13  |   test('should load election and display candidates', async ({ page }) => {
  14  |     // Check if candidates are rendered
  15  |     const candidates = await page.locator('.candidate-row');
  16  |     const count = await candidates.count();
  17  |     
  18  |     expect(count).toBeGreaterThan(0);
  19  |     console.log(`✅ Loaded ${count} candidates`);
  20  |     
  21  |     // Check election title
  22  |     const title = await page.locator('#election-title');
  23  |     await expect(title).toBeVisible();
  24  |     const titleText = await title.textContent();
  25  |     expect(titleText).toBeTruthy();
  26  |   });
  27  | 
  28  |   test('should record a vote successfully', async ({ page }) => {
  29  |     // Wait for candidates to load
  30  |     await page.waitForSelector('.vote-button', { timeout: 5000 });
  31  |     
  32  |     // Get first candidate
  33  |     const firstVoteButton = await page.locator('.vote-button').first();
  34  |     const candidateName = await page.locator('.candidate-name').first().textContent();
  35  |     
  36  |     console.log(`🗳️ Voting for: ${candidateName}`);
  37  |     
  38  |     // Click vote button
> 39  |     await firstVoteButton.click();
      |                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  40  |     
  41  |     // Wait for success message
  42  |     const messageBox = page.locator('#message-box');
  43  |     await expect(messageBox).toContainText('Vote recorded successfully', { timeout: 5000 });
  44  |     
  45  |     console.log('✅ Vote recorded successfully');
  46  |   });
  47  | 
  48  |   test('should show admin panel after login', async ({ page }) => {
  49  |     // Navigate to admin page
  50  |     await page.goto(`${baseURL}/admin.html`);
  51  |     
  52  |     // Wait for login form
  53  |     await page.waitForSelector('#login-form', { timeout: 5000 });
  54  |     
  55  |     // Fill password
  56  |     const passwordInput = page.locator('#admin-password');
  57  |     await passwordInput.fill('admin123');
  58  |     
  59  |     // Submit form
  60  |     const submitButton = page.locator('#login-form button[type="submit"]');
  61  |     await submitButton.click();
  62  |     
  63  |     // Wait for admin dashboard to appear
  64  |     const adminDashboard = page.locator('#admin-dashboard');
  65  |     await expect(adminDashboard).toBeVisible({ timeout: 5000 });
  66  |     
  67  |     console.log('✅ Admin login successful');
  68  |   });
  69  | 
  70  |   test('should reject invalid admin password', async ({ page }) => {
  71  |     // Navigate to admin page
  72  |     await page.goto(`${baseURL}/admin.html`);
  73  |     
  74  |     // Wait for login form
  75  |     await page.waitForSelector('#login-form', { timeout: 5000 });
  76  |     
  77  |     // Fill wrong password
  78  |     const passwordInput = page.locator('#admin-password');
  79  |     await passwordInput.fill('wrongpassword');
  80  |     
  81  |     // Submit form
  82  |     const submitButton = page.locator('#login-form button[type="submit"]');
  83  |     await submitButton.click();
  84  |     
  85  |     // Wait for error message
  86  |     const loginMessage = page.locator('#login-message');
  87  |     await expect(loginMessage).toContainText('Incorrect password', { timeout: 5000 });
  88  |     
  89  |     console.log('✅ Invalid password correctly rejected');
  90  |   });
  91  | 
  92  |   test('should display voting results', async ({ page }) => {
  93  |     // Make a vote first
  94  |     await page.waitForSelector('.vote-button', { timeout: 5000 });
  95  |     const firstVoteButton = await page.locator('.vote-button').first();
  96  |     await firstVoteButton.click();
  97  |     await page.waitForSelector('.message-box', { timeout: 5000 });
  98  |     
  99  |     // Now check if results API endpoint works
  100 |     const response = await page.request.get(`${baseURL}/api/results`);
  101 |     expect(response.ok()).toBeTruthy();
  102 |     
  103 |     const results = await response.json();
  104 |     expect(results).toHaveProperty('candidates');
  105 |     expect(Array.isArray(results.candidates)).toBeTruthy();
  106 |     
  107 |     console.log('✅ Results API working, received:', results.candidates.length, 'candidates');
  108 |   });
  109 | 
  110 |   test('should get election data from API', async ({ page }) => {
  111 |     // Test the election API endpoint
  112 |     const response = await page.request.get(`${baseURL}/api/election`);
  113 |     expect(response.ok()).toBeTruthy();
  114 |     
  115 |     const data = await response.json();
  116 |     expect(data).toHaveProperty('election');
  117 |     expect(data).toHaveProperty('candidates');
  118 |     expect(Array.isArray(data.candidates)).toBeTruthy();
  119 |     expect(data.candidates.length).toBeGreaterThan(0);
  120 |     
  121 |     console.log('✅ Election API working, received:', {
  122 |       title: data.election.title,
  123 |       candidates: data.candidates.length,
  124 |       totalVotes: data.totalVotes,
  125 |     });
  126 |   });
  127 | 
  128 |   test('should reset votes as admin', async ({ page }) => {
  129 |     // Login as admin
  130 |     await page.goto(`${baseURL}/admin.html`);
  131 |     await page.waitForSelector('#login-form', { timeout: 5000 });
  132 |     
  133 |     const passwordInput = page.locator('#admin-password');
  134 |     await passwordInput.fill('admin123');
  135 |     const submitButton = page.locator('#login-form button[type="submit"]');
  136 |     await submitButton.click();
  137 |     
  138 |     // Wait for admin dashboard
  139 |     await page.waitForSelector('#admin-dashboard', { timeout: 5000 });
```