import { expect } from '@playwright/test';
import { test } from './test';
import { db } from '../src/lib/db';

test.describe('Signup flow', async () => {
	test.afterAll(async ({ users }) => {
		await users.deleteAll();
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
		await page.getByRole('button', { name: 'Sign up' }).click();
		await page.waitForLoadState('networkidle');
		const newUser = await users.set(userToCreate.email);
		expect(newUser).not.toBeNull();

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
