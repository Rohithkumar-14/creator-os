import { test, expect, waitForAppReady } from './fixtures';

test.describe('Dashboard and Global Navigation', () => {
  test('launches app and renders Studio Dashboard with summary cards', async ({
    page,
    consoleErrors,
    failedRequests,
  }) => {
    await waitForAppReady(page);

    // Verify Dashboard Title and Subtitle in Topbar
    await expect(page.locator('h1')).toHaveText('Studio Dashboard');
    await expect(
      page.getByText('Overview of your pipeline, deadlines, and publishing schedule')
    ).toBeVisible();

    // Verify Metric Summary Cards are displayed
    await expect(page.getByText('Active Content', { exact: true })).toBeVisible();
    await expect(page.getByText('Tasks In Progress', { exact: true })).toBeVisible();
    await expect(page.getByText('7-Day Deadlines', { exact: true })).toBeVisible();
    await expect(page.getByText('Idea Vault', { exact: true }).first()).toBeVisible();

    // Verify Pipeline, Deadlines, and Priorities widgets
    await expect(page.getByText('Production Pipeline Distribution')).toBeVisible();
    await expect(page.getByText('Approaching Deadlines')).toBeVisible();
    await expect(page.getByText("Today's Priorities")).toBeVisible();
    await expect(page.getByText('Active Video Projects')).toBeVisible();

    // Verify zero console errors and zero failed requests
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test('navigates seamlessly across all sidebar sections', async ({
    page,
    consoleErrors,
    failedRequests,
  }) => {
    await waitForAppReady(page);

    const sections = [
      {
        tab: 'Content Planner',
        expectedTitle: 'Content Planner',
        expectedHash: '#planner',
      },
      {
        tab: 'Creator Diary',
        expectedTitle: 'Creator Diary & Idea Vault',
        expectedHash: '#diary',
      },
      {
        tab: 'Task Manager',
        expectedTitle: 'Production Tasks',
        expectedHash: '#tasks',
      },
      {
        tab: 'Calendar',
        expectedTitle: 'Publishing Calendar',
        expectedHash: '#calendar',
      },
      {
        tab: 'Settings',
        expectedTitle: 'Settings & Storage',
        expectedHash: '#settings',
      },
      {
        tab: 'Dashboard',
        expectedTitle: 'Studio Dashboard',
        expectedHash: '#dashboard',
      },
    ];

    for (const section of sections) {
      // Click the sidebar navigation button
      const navButton = page.locator('aside nav button').filter({ hasText: section.tab });
      await navButton.click();

      // Verify the Topbar h1 updates to the expected title
      await expect(page.locator('h1')).toHaveText(section.expectedTitle);

      // Verify URL hash updates
      await expect(page).toHaveURL(new RegExp(`${section.expectedHash}$`));
    }

    // Verify zero console errors and zero failed requests
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
});
