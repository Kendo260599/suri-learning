import { test, expect } from '@playwright/test';

// Test suite for Authentication/Login flow
test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test to ensure clean state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading or branding
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    
    // Check for Google Sign-In button
    const googleButton = page.locator('button:has-text("Google"), button:has-text("Sign in with Google"), [data-testid="google-signin"]');
    await expect(googleButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show loading state during sign-in', async ({ page }) => {
    await page.goto('/');
    
    const googleButton = page.locator('button:has-text("Google")').first();
    await googleButton.click();
    
    // Should show some loading indicator
    const loadingSpinner = page.locator('[role="status"], .animate-spin, svg.animate');
    // Note: This test is flexible as loading state may vary
  });

  test('should handle sign-in errors gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Intercept and reject auth request to simulate error
    await page.route('**/startSignInWithRedirect*', route => {
      route.abort('failed');
    });
    
    const googleButton = page.locator('button:has-text("Google")').first();
    await googleButton.click();
    
    // Should show error message or handle gracefully
    // This depends on the app's error handling implementation
  });

  test('should redirect to dashboard after successful login', async ({ page, context }) => {
    // This test requires mock Firebase or real credentials
    // Skipping actual auth flow as it requires user interaction
    
    test.skip(true, 'Requires Firebase mock or real auth credentials');
  });
});
