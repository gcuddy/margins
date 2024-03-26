import { type Page } from '@playwright/test';
import type { User } from '../../src/lib/prisma/kysely/types';
import { db } from '../../src/lib/db';
import { type Selectable } from 'kysely';
import { generateId } from 'lucia';

type CustomUserOpts = Partial<User> & {
	password?: string | null;
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
export type UserFixture = ReturnType<typeof createUserFixture>;

export const createUsersFixture = (page: Page) => {
	const store: {
		users: UserFixture[];
	} = {
		users: [],
	};
	return {
		buildForSignup: (
			opts: Required<Pick<CustomUserOpts, 'email' | 'password'>>,
		) => {
			return {
				email: opts.email,
				password: opts.password ?? 'Password99!',
			};
		},
		create: async ({ password, ...user }: CustomUserOpts) => {
			const userId = generateId(15);
			await db
				.insertInto('user')
				.values({
					id: userId,
					email_verified: user.email_verified,
					email: user.email ?? '',
					updatedAt: new Date(),
				})
				.execute();

			const dbUser = await db
				.selectFrom('user')
				.selectAll()
				.where('id', '=', userId)
				.executeTakeFirstOrThrow();

			const userFixture = createUserFixture(dbUser, page);
			store.users.push(userFixture);
			return userFixture;
		},
		deleteAll: async () => {
			const ids = store.users.map((u) => u.id);
			await db.deleteFrom('user').where('id', 'in', ids).execute();
			store.users = [];
		},
		set: async (email: string) => {
			const user = await db
				.selectFrom('user')
				.selectAll()
				.where('email', '=', email)
				.executeTakeFirstOrThrow();
			const userFixture = createUserFixture(user, page);
			store.users.push(userFixture);
			return userFixture;
		},
	};
};

export const createUserFixture = (user: Selectable<User>, page: Page) => {
	const store = {
		user,
		page,
	};
	return {
		...user,
		delete: async () =>
			await db.deleteFrom('user').where('id', '=', store.user.id).execute(),
	};
};
