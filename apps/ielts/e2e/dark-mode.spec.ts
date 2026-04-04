import { test, expect } from '@playwright/test';

test.describe('Dark Mode Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have dark mode toggle button', async ({ page }) => {
    // Look for theme/dark mode toggle
    const themeButton = page.locator(
      'button:has-text("Dark"), button:has-text("Light"), button:has-text("Theme"), [data-testid="theme-toggle"]'
    );
    
    const buttonVisible = await themeButton.first().isVisible().catch(() => false);
    expect(buttonVisible).toBe(true);
  });

  test('should toggle dark mode when clicked', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], [data-testid="theme-toggle"]').first();
    
    if (await themeButton.isVisible().catch(() => false)) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      );
      
      // Click toggle
      await themeButton.click();
      await page.waitForTimeout(300);
      
      // Check theme changed
      const newTheme = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      );
      
      expect(newTheme).toBe(!initialTheme);
    }
  });

  test('should persist dark mode preference', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], [data-testid="theme-toggle"]').first();
    
    if (await themeButton.isVisible().catch(() => false)) {
      // Enable dark mode
      await themeButton.click();
      await page.waitForTimeout(300);
      
      // Reload page
      await page.reload();
      await page.waitForTimeout(1000);
      
      // Dark mode should persist
      const isDark = await page.evaluate(() => 
        document.documentElement.classList.contains('dark') || 
        localStorage.getItem('theme') === 'dark'
      );
      
      expect(isDark).toBe(true);
    }
  });

  test('should toggle between light and dark modes', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], [data-testid="theme-toggle"]').first();
    
    if (await themeButton.isVisible().catch(() => false)) {
      // Toggle to dark
      await themeButton.click();
      await page.waitForTimeout(200);
      const isDark1 = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      );
      expect(isDark1).toBe(true);
      
      // Toggle back to light
      await themeButton.click();
      await page.waitForTimeout(200);
      const isDark2 = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      );
      expect(isDark2).toBe(false);
    }
  });
});
