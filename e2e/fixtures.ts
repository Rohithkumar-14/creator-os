import { test as base, expect, Page } from '@playwright/test';

export interface TestFixtures {
  consoleErrors: string[];
  failedRequests: string[];
}

export const test = base.extend<TestFixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });
    // oxlint-disable-next-line react-hooks/rules-of-hooks
    await use(errors);
  },
  failedRequests: async ({ page }, use) => {
    const failed: string[] = [];
    page.on('requestfailed', (req) => {
      // Ignore favicon or optional asset cancelations if any
      const url = req.url();
      if (!url.includes('favicon.ico')) {
        failed.push(`${req.method()} ${url} - ${req.failure()?.errorText || 'Unknown failure'}`);
      }
    });
        // oxlint-disable-next-line react-hooks/rules-of-hooks
    await use(failed);
  },
});

export { expect };

// Helper to wait for the app shell and view to be ready
export async function waitForAppReady(page: Page) {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByText('Creator OS', { exact: false }).first()).toBeVisible();
}
