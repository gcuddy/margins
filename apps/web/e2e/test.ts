import type { DB} from '@margins/db';
import { createDb } from '@margins/db';
import { type UsersFixture, createUsersFixture } from './fixtures/users';
import { test as base } from '@playwright/test';

type Fixtures = {
	db: DB;
	users: UsersFixture;
};

const baseWithDB = base.extend<{
	db: DB;
}>({
	db: async (_, use) => {
		// TODO: test config
		const db = createDb({});
		await use(db);
	},
});

export const test = baseWithDB.extend<Fixtures>({
	users: async ({ db, page }, use, workerInfo) => {
		const usersFixture = createUsersFixture(db, page, workerInfo);
		await use(usersFixture);
	},
});
