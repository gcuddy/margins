import { expect } from '@playwright/test';
import { test } from './test';

test.describe.configure({ mode: 'parallel' });

test.describe('Signup flow', async () => {
	test.afterEach(async ({ users }) => {
		await users.deleteAll();
	});
	// TODO: logout

	test('Login flow and logout', async ({ page, users }) => {
		// TODO: test password insert and password hashing
		await test.step('Log in', async () => {
			const user = await users.create();
			await user.login();
			// expect(false).toBe(true);
			// const shellLocator = page.locator(`[data-testid=dashboard-shell]`);
			await page.waitForURL('/library/backlog');
			// await expect(shellLocator).toBeVisible();
		});

		await test.step('Log out', async () => {
			const signOutBtn = page.getByTestId('logout-btn');
			await signOutBtn.click();
			await expect(page.getByTestId('login-form')).toBeVisible();
		});
	});
});
