import { type UsersFixture, createUsersFixture } from './fixtures/users';
import { test as base } from '@playwright/test';

type Fixtures = {
	users: UsersFixture;
};

export const test = base.extend<Fixtures>({
	users: async ({ page }, use, workerInfo) => {
		const usersFixture = createUsersFixture(page, workerInfo);
		await use(usersFixture);
	},
});
