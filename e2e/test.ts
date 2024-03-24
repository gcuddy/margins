import { type UsersFixture, createUsersFixture } from './fixtures/users';
import { test as base } from '@playwright/test';

type Fixtures = {
	users: UsersFixture;
};

export const test = base.extend<Fixtures>({
	users: async ({ page }, use) => {
		const usersFixture = createUsersFixture(page);
		await use(usersFixture);
	},
});
