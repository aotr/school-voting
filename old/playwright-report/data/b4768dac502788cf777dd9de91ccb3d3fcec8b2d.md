# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: voting.spec.ts >> Voting System E2E Tests >> should reset votes as admin
- Location: tests/e2e/voting.spec.ts:128:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('#admin-dashboard') to be visible
    15 × locator resolved to hidden <section id="admin-dashboard" class="admin-dashboard hidden">…</section>

```

# Page snapshot

```yaml
- main [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - paragraph [ref=e6]: School Election Admin
        - heading "Manage Voting Setup" [level=1] [ref=e7]
      - link "Back To Voting" [ref=e9] [cursor=pointer]:
        - /url: ./index.html
    - generic [ref=e11]:
      - heading "Admin Access" [level=2] [ref=e12]
      - paragraph [ref=e13]: Use the admin password to manage candidates, election info, and backup data.
      - generic [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e16]: Password
          - textbox "Password" [ref=e17]:
            - /placeholder: Enter admin password
            - text: admin123
        - button "Open Admin Panel" [active] [ref=e18] [cursor=pointer]
      - paragraph [ref=e19]:
        - text: "Default password for this prototype:"
        - strong [ref=e20]: admin123
      - generic [ref=e21]: Incorrect password. Please try again.
```

# Test source

```ts
  39  |     await firstVoteButton.click();
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
> 139 |     await page.waitForSelector('#admin-dashboard', { timeout: 5000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
  140 |     
  141 |     // Test reset votes API
  142 |     const response = await page.request.post(`${baseURL}/api/admin/reset-votes`);
  143 |     expect(response.ok()).toBeTruthy();
  144 |     
  145 |     const result = await response.json();
  146 |     expect(result.success).toBeTruthy();
  147 |     
  148 |     console.log('✅ Votes reset successfully');
  149 |   });
  150 | 
  151 |   test('should check admin session status', async ({ page }) => {
  152 |     // Check without login
  153 |     let response = await page.request.get(`${baseURL}/api/admin/status`);
  154 |     expect(response.ok()).toBeTruthy();
  155 |     
  156 |     let status = await response.json();
  157 |     expect(status.isAdmin).toBeFalsy();
  158 |     console.log('✅ Unauthenticated user is not admin');
  159 |     
  160 |     // Login and check again
  161 |     await page.goto(`${baseURL}/admin.html`);
  162 |     await page.waitForSelector('#login-form', { timeout: 5000 });
  163 |     
  164 |     const passwordInput = page.locator('#admin-password');
  165 |     await passwordInput.fill('admin123');
  166 |     const submitButton = page.locator('#login-form button[type="submit"]');
  167 |     await submitButton.click();
  168 |     
  169 |     // Check status again
  170 |     response = await page.request.get(`${baseURL}/api/admin/status`);
  171 |     expect(response.ok()).toBeTruthy();
  172 |     
  173 |     status = await response.json();
  174 |     expect(status.isAdmin).toBeTruthy();
  175 |     console.log('✅ Authenticated user is admin');
  176 |   });
  177 | 
  178 |   test('should handle API errors gracefully', async ({ page }) => {
  179 |     // Test invalid endpoint
  180 |     const response = await page.request.get(`${baseURL}/api/invalid-endpoint`);
  181 |     expect(response.status()).toBe(404);
  182 |     
  183 |     const error = await response.json();
  184 |     expect(error).toHaveProperty('error');
  185 |     console.log('✅ API error handling working');
  186 |   });
  187 | });
  188 | 
```