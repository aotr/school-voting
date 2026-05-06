import { test, expect } from '@playwright/test';

test.describe('Voting System E2E Tests', () => {
  const baseURL = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    // Navigate to the voting page
    await page.goto(baseURL);
    // Wait for the page to load
    await page.waitForSelector('#candidate-list', { timeout: 10000 });
  });

  test('should load election and display candidates', async ({ page }) => {
    // Check if candidates are rendered
    const candidates = await page.locator('.candidate-row');
    const count = await candidates.count();
    
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Loaded ${count} candidates`);
    
    // Check election title
    const title = await page.locator('#election-title');
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
  });

  test('should record a vote successfully', async ({ page }) => {
    // Wait for candidates to load
    await page.waitForSelector('.vote-button', { timeout: 5000 });
    
    // Get first candidate
    const firstVoteButton = await page.locator('.vote-button').first();
    const candidateName = await page.locator('.candidate-name').first().textContent();
    
    console.log(`🗳️ Voting for: ${candidateName}`);
    
    // Click vote button
    await firstVoteButton.click();
    
    // Wait for success message
    const messageBox = page.locator('#message-box');
    await expect(messageBox).toContainText('Vote recorded successfully', { timeout: 5000 });
    
    console.log('✅ Vote recorded successfully');
  });

  test('should show admin panel after login', async ({ page }) => {
    // Navigate to admin page
    await page.goto(`${baseURL}/admin.html`);
    
    // Wait for login form
    await page.waitForSelector('#login-form', { timeout: 5000 });
    
    // Fill password
    const passwordInput = page.locator('#admin-password');
    await passwordInput.fill('admin123');
    
    // Submit form
    const submitButton = page.locator('#login-form button[type="submit"]');
    await submitButton.click();
    
    // Wait for admin dashboard to appear
    const adminDashboard = page.locator('#admin-dashboard');
    await expect(adminDashboard).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Admin login successful');
  });

  test('should reject invalid admin password', async ({ page }) => {
    // Navigate to admin page
    await page.goto(`${baseURL}/admin.html`);
    
    // Wait for login form
    await page.waitForSelector('#login-form', { timeout: 5000 });
    
    // Fill wrong password
    const passwordInput = page.locator('#admin-password');
    await passwordInput.fill('wrongpassword');
    
    // Submit form
    const submitButton = page.locator('#login-form button[type="submit"]');
    await submitButton.click();
    
    // Wait for error message
    const loginMessage = page.locator('#login-message');
    await expect(loginMessage).toContainText('Incorrect password', { timeout: 5000 });
    
    console.log('✅ Invalid password correctly rejected');
  });

  test('should display voting results', async ({ page }) => {
    // Make a vote first
    await page.waitForSelector('.vote-button', { timeout: 5000 });
    const firstVoteButton = await page.locator('.vote-button').first();
    await firstVoteButton.click();
    await page.waitForSelector('.message-box', { timeout: 5000 });
    
    // Now check if results API endpoint works
    const response = await page.request.get(`${baseURL}/api/results`);
    expect(response.ok()).toBeTruthy();
    
    const results = await response.json();
    expect(results).toHaveProperty('candidates');
    expect(Array.isArray(results.candidates)).toBeTruthy();
    
    console.log('✅ Results API working, received:', results.candidates.length, 'candidates');
  });

  test('should get election data from API', async ({ page }) => {
    // Test the election API endpoint
    const response = await page.request.get(`${baseURL}/api/election`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('election');
    expect(data).toHaveProperty('candidates');
    expect(Array.isArray(data.candidates)).toBeTruthy();
    expect(data.candidates.length).toBeGreaterThan(0);
    
    console.log('✅ Election API working, received:', {
      title: data.election.title,
      candidates: data.candidates.length,
      totalVotes: data.totalVotes,
    });
  });

  test('should reset votes as admin', async ({ page }) => {
    // Login as admin
    await page.goto(`${baseURL}/admin.html`);
    await page.waitForSelector('#login-form', { timeout: 5000 });
    
    const passwordInput = page.locator('#admin-password');
    await passwordInput.fill('admin123');
    const submitButton = page.locator('#login-form button[type="submit"]');
    await submitButton.click();
    
    // Wait for admin dashboard
    await page.waitForSelector('#admin-dashboard', { timeout: 5000 });
    
    // Test reset votes API
    const response = await page.request.post(`${baseURL}/api/admin/reset-votes`);
    expect(response.ok()).toBeTruthy();
    
    const result = await response.json();
    expect(result.success).toBeTruthy();
    
    console.log('✅ Votes reset successfully');
  });

  test('should check admin session status', async ({ page }) => {
    // Check without login
    let response = await page.request.get(`${baseURL}/api/admin/status`);
    expect(response.ok()).toBeTruthy();
    
    let status = await response.json();
    expect(status.isAdmin).toBeFalsy();
    console.log('✅ Unauthenticated user is not admin');
    
    // Login and check again
    await page.goto(`${baseURL}/admin.html`);
    await page.waitForSelector('#login-form', { timeout: 5000 });
    
    const passwordInput = page.locator('#admin-password');
    await passwordInput.fill('admin123');
    const submitButton = page.locator('#login-form button[type="submit"]');
    await submitButton.click();
    
    // Check status again
    response = await page.request.get(`${baseURL}/api/admin/status`);
    expect(response.ok()).toBeTruthy();
    
    status = await response.json();
    expect(status.isAdmin).toBeTruthy();
    console.log('✅ Authenticated user is admin');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Test invalid endpoint
    const response = await page.request.get(`${baseURL}/api/invalid-endpoint`);
    expect(response.status()).toBe(404);
    
    const error = await response.json();
    expect(error).toHaveProperty('error');
    console.log('✅ API error handling working');
  });
});
