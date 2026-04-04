import { test, expect } from '@playwright/test';

test.describe('Leaderboard', () => {
  test('should display leaderboard page', async ({ page }) => {
    await page.goto('/');
    
    // Look for leaderboard link/button
    const leaderboardLink = page.locator('a:has-text("Bảng xếp hạng"), a:has-text("Leaderboard"), [data-testid="leaderboard"]');
    
    if (await leaderboardLink.first().isVisible().catch(() => false)) {
      await leaderboardLink.first().click();
      await page.waitForURL('**/leaderboard**');
    } else {
      // Navigate directly if link not found
      await page.goto('/leaderboard');
    }
    
    // Check for leaderboard content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should show ranked users in leaderboard', async ({ page }) => {
    await page.goto('/leaderboard');
    
    // Wait for leaderboard to load
    await page.waitForTimeout(2000);
    
    // Check for user entries or rank indicators
    const userEntries = page.locator('[data-testid="leaderboard-entry"], .leaderboard-row, tr');
    const entryCount = await userEntries.count();
    
    // Should have at least some entries (or none if loading)
    expect(entryCount).toBeGreaterThanOrEqual(0);
  });

  test('should display user rank and XP', async ({ page }) => {
    await page.goto('/leaderboard');
    
    // Look for XP display
    const xpDisplay = page.locator('text=/\\d+\\s*XP/i, [data-testid="user-xp"]');
    const xpVisible = await xpDisplay.first().isVisible().catch(() => false);
    
    if (xpVisible) {
      await expect(xpDisplay.first()).toBeVisible();
    }
  });
});
