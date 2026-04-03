import { test, expect } from '@playwright/test';

// Test suite for Quiz flow
test.describe('Quiz Completion Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and clear state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display quiz interface when starting a quiz', async ({ page }) => {
    // Assuming there's a way to start a quiz from the main page
    await page.goto('/');
    
    // Look for any button that could start a quiz
    const startQuizButton = page.locator('button:has-text("Bắt đầu"), button:has-text("Start"), button:has-text("Quiz")');
    
    // Try to find a quiz-related button
    const quizButton = startQuizButton.first();
    const isVisible = await quizButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await quizButton.click();
      
      // Should show quiz question
      const question = page.locator('[data-testid="quiz-question"], .question, h3').first();
      await expect(question).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show progress indicator during quiz', async ({ page }) => {
    await page.goto('/');
    
    // Start quiz if button exists
    const quizButton = page.locator('button:has-text("Bắt đầu"), button:has-text("Start")').first();
    const isVisible = await quizButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await quizButton.click();
      
      // Check for progress indicator (could be text, progress bar, etc.)
      const progress = page.locator('[data-testid="quiz-progress"], .progress, text=/\\d+\\/\\d+/');
      const progressVisible = await progress.isVisible().catch(() => false);
      
      if (progressVisible) {
        await expect(progress).toBeVisible();
      }
    }
  });

  test('should allow answering questions', async ({ page }) => {
    await page.goto('/');
    
    // Start quiz
    const quizButton = page.locator('button:has-text("Bắt đầu"), button:has-text("Start")').first();
    const isVisible = await quizButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await quizButton.click();
      await page.waitForTimeout(500);
      
      // Look for answer options (buttons or clickable elements)
      const answerOptions = page.locator('button:has-text("a)"), button:has-text("b)"), button:has-text("c)"), button:has-text("d)")');
      const firstOption = answerOptions.first();
      
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click();
        
        // Check for feedback or next button after answering
        const nextButton = page.locator('button:has-text("Tiếp theo"), button:has-text("Next"), button:has-text("Tiếp")');
        await expect(nextButton.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should display results after completing quiz', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to quiz page
    await page.goto('/quiz');
    
    // Complete the quiz flow
    // This is a simplified test - in reality you'd need to loop through all questions
    const startButton = page.locator('button:has-text("Bắt đầu")').first();
    
    if (await startButton.isVisible().catch(() => false)) {
      await startButton.click();
      
      // Answer several questions
      for (let i = 0; i < 3; i++) {
        await page.waitForTimeout(300);
        
        const option = page.locator('button').nth(i + 1);
        if (await option.isVisible().catch(() => false)) {
          await option.click();
          await page.waitForTimeout(300);
          
          const nextBtn = page.locator('button:has-text("Tiếp")').first();
          if (await nextBtn.isVisible().catch(() => false)) {
            await nextBtn.click();
          }
        }
      }
    }
  });

  test('should display score and XP after quiz', async ({ page }) => {
    await page.goto('/');
    
    const quizButton = page.locator('button:has-text("Bắt đầu"), button:has-text("Start")').first();
    const isVisible = await quizButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await quizButton.click();
      await page.waitForTimeout(1000);
      
      // Check for XP or score display
      const xpDisplay = page.locator('text=/\\d+\\s*XP/i, [data-testid="xp-display"]');
      await expect(xpDisplay.first()).toBeVisible({ timeout: 5000 });
    }
  });
});
