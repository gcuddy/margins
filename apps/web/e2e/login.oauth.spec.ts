import { expect, test } from '@playwright/test';

test('Should display Google Login button', async ({ page }) => {
	await page.goto(`/login`);
	// TODO: actually test oauth somehow?
	await expect(page.locator(`[data-testid=google]`)).toBeVisible();
});
