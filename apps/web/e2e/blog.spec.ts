import { test, expect } from '@playwright/test';

test('Blog smoke test', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Blog' }).click();
	await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
	await expect(page.getByTestId('blog-posts')).toBeVisible();
});
