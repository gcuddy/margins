import { expect } from '@playwright/test';
import { test } from './test';
import { db } from '@margins/db';

test.describe.configure({ mode: 'parallel' });

test.describe('Signup flow', async () => {
	test.afterEach(async ({ users }) => {
		await users.deleteAll();
	});
	test.fixme('Username is taken', async ({ page, users }) => {
		await test.step('signup', async () => {
			// const user = await users.create({
			// 	username: 'gus',
			// });
			// TODO: ... write rest of test, depends on alert
		});
	});
	test('Signup with valid email and password', async ({ page, users }) => {
		const userToCreate = users.buildForSignup({
			email: `rickjones${Math.random()}-${Date.now()}@margins.gg`,
			password: 'Password99!',
		});
		await page.goto('/');
		await page.getByRole('link', { name: 'Sign up' }).click();
		await page.getByLabel('Email').click();
		await page.getByLabel('Email').fill(userToCreate.email);
		await page.getByLabel('Password').click();
		await page.getByLabel('Password').fill(userToCreate.password);
		const button = page.getByRole('button', { name: 'Sign up' });
		await button.click();
		await button.waitFor({ state: 'detached' });
		await page.waitForLoadState('networkidle');
		await page.screenshot({ path: 'tests-results/screenshot.png' });
		const newUser = await users.set(userToCreate.email);
		expect(newUser.id).not.toBeNull();

		// TODO: email verification testing?
		expect(page.url()).toContain('/library/');

		const dbUser = await db
			.selectFrom('user')
			.selectAll()
			.where('email', '=', userToCreate.email)
			.executeTakeFirst();

		expect(dbUser?.email).toBe(userToCreate.email);
	});
});
