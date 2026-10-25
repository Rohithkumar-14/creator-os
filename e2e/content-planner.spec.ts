
import { test, expect, waitForAppReady } from './fixtures';

test.describe('Content Planner Workflow', () => {
  test('creates, inspects checklist, edits, and deletes a video project', async ({
    page,
    consoleErrors,
    failedRequests,
  }) => {
    await waitForAppReady(page);

    // 1. Navigate to Content Planner
    await page
      .locator('aside nav button')
      .filter({ hasText: 'Content Planner' })
      .click();

    await expect(page.locator('h1')).toHaveText('Content Planner');

    // Switch to table view
    await page.locator('button[aria-label="Table View"]').click();

    // 2. Open New Video modal
    await page.getByRole('button', { name: 'New Video' }).first().click();

    await expect(
      page.getByRole('dialog', { name: 'Create New Video Project' })
    ).toBeVisible();

    // Fill form
    const videoTitle = 'E2E Automation Masterclass';

    await page.getByPlaceholder(/How I Code/i).fill(videoTitle);

    // Select Instagram Reel platform
    await page.getByRole('button', { name: /Instagram Reel/i }).click();

    // Inspect available stage options
    const stageDropdown = page.locator('select').first();

    console.log(
      'Available stage options:',
      await stageDropdown.locator('option').allTextContents()
    );

    // TEMPORARY: Skip stage selection until we confirm its options.

    // Add tag
    await page.getByPlaceholder(/Add tag/i).fill('testing');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('#testing')).toBeVisible();

    // Add script notes
    await page
      .getByPlaceholder(/Write hook/i)
      .fill('Hook: Automated E2E testing in action.');

    // Submit form
    await page.getByRole('button', { name: 'Create Video' }).click();

    // Verify modal closed
    await expect(
      page.getByRole('dialog', { name: 'Create New Video Project' })
    ).not.toBeVisible();

    // 3. Verify video project appears in the table
    const tableRow = page.locator('tbody tr').filter({
      hasText: videoTitle,
    });

    await expect(tableRow).toBeVisible();
    await expect(tableRow.getByText('Reel')).toBeVisible();

    // 4. Open Content Detail Drawer
    await tableRow.click();

    const drawer = page.getByRole('dialog', {
      name: `Content details for ${videoTitle}`,
    });

    await expect(drawer).toBeVisible();

    // Verify script notes
    await expect(
      drawer.getByText('Hook: Automated E2E testing in action.')
    ).toBeVisible();

    // Test checklist toggle
    const checklistButton = drawer.getByRole('button', {
      name: /Mark Thumbnail Variants as/i,
    });

    await expect(checklistButton).toBeVisible();
    await checklistButton.click();

    await expect(
      drawer.getByRole('button', {
        name: /Mark Thumbnail Variants as incomplete/i,
      })
    ).toBeVisible();

    // Close drawer
    await page.getByRole('button', {
      name: 'Close detail drawer',
    }).click();

    await expect(drawer).not.toBeVisible();

    // 5. Edit the video project
    const editBtn = tableRow.getByRole('button', {
      name: 'Edit project',
    });

    await editBtn.click();

    await expect(
      page.getByRole('dialog', { name: 'Edit Content Details' })
    ).toBeVisible();

    const updatedTitle = 'E2E Automation Masterclass (Updated)';

    await page.getByPlaceholder(/How I Code/i).fill(updatedTitle);
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify updated title
    const updatedRow = page.locator('tbody tr').filter({
      hasText: updatedTitle,
    });

    await expect(updatedRow).toBeVisible();

    // 6. Delete the video project
    await updatedRow.getByRole('button', {
      name: 'Delete project',
    }).click();

    await expect(
      page.getByText(/Are you sure you want to permanently delete/i)
    ).toBeVisible();

    await page.getByRole('button', {
      name: 'Delete Permanently',
    }).click();

    // Verify item is removed
    await expect(
      page.locator('tbody tr').filter({ hasText: updatedTitle })
    ).not.toBeVisible();

    // Verify zero console errors and failed requests
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
});
