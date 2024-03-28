import type { Page, WorkerInfo } from '@playwright/test';
import type { User } from '@margins/db/kysely/types';
import { db } from '@margins/db';
import type { Insertable, type Selectable } from 'kysely';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

type CustomUserOpts = Partial<User> & {
	emailDomain?: string;
	password?: string | null;
	useExactUsername?: boolean;
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
export type UserFixture = ReturnType<typeof createUserFixture>;

async function hashPassword(password: string) {
	const hashed_password = await new Argon2id().hash(password);
	return hashed_password;
}

export const createUsersFixture = (page: Page, workerInfo: WorkerInfo) => {
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
		create: async (opts?: CustomUserOpts) => {
			const user = createUser(workerInfo, opts);
			const userId = generateId(15);
			const pass = opts?.password ?? user.username!;
			console.log('hashing password', pass);
			const hashed_password = await hashPassword(pass);
			await db.transaction().execute(async (trx) => {
				await db
					.insertInto('user')
					.values({
						...user,
						id: userId,
						updatedAt: new Date(),
					})
					.execute();

				console.log('inserting password', hashed_password, userId, pass);

				return await db
					.insertInto('password')
					.values({
						hashed_password,
						id: generateId(15),
						user_id: userId,
					})
					.execute();
			});

			const dbUser = await db
				.selectFrom('user')
				.selectAll()
				.where('id', '=', userId)
				.executeTakeFirstOrThrow();

			const userFixture = createUserFixture(
				{
					...dbUser,
					password: pass,
				},
				page,
			);
			store.users.push(userFixture);
			return userFixture;
		},
		deleteAll: async () => {
			console.log('deleting all test users');
			const ids = store.users.map((u) => u.id);
			await db.deleteFrom('user').where('id', 'in', ids).execute();
			await db.deleteFrom('password').where('user_id', 'in', ids).execute();
			await db
				.deleteFrom('EmailVerificationToken')
				.where('user_id', 'in', ids)
				.execute();
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

const createUser = (
	workerInfo: WorkerInfo,
	opts?: CustomUserOpts | null,
): Omit<Insertable<User>, 'userId'> => {
	const uname =
		opts?.useExactUsername && opts?.username
			? opts.username
			: `${opts?.username || 'user'}-${workerInfo.workerIndex}-${Date.now()}`;

	const emailDomain = opts?.emailDomain || 'example.com';

	// TODO: password hash
	return {
		email: opts?.email ?? `${uname}@${emailDomain}`,
		email_verified: 1,
		id: generateId(15),
		updatedAt: new Date(),
		username: uname,
	};
};

export const createUserFixture = (
	user: Selectable<User> & {
		password?: string | null;
	},
	page: Page,
) => {
	const store = {
		page,
		user,
	};
	console.log(`creatuserfixture`, user);
	return {
		...user,
		delete: async () =>
			await db.deleteFrom('user').where('id', '=', store.user.id).execute(),
		login: async () => {
			await login(user, page);
		},
	};
};

export async function login(
	user: Selectable<User> & { password?: string | null },
	page: Page,
) {
	await page.goto('/login');
	await page.getByLabel('Email').click();
	await page
		.getByLabel('Email')
		.fill(user.email ?? `${user.username}@example.com`);
	await page.getByLabel('Password').click();
	const pass = user.password ?? user.username!;
	console.log({ pass });
	await page.getByLabel('Password').fill(pass);
	await page.getByRole('button', { name: 'Login' }).click();

	// waiting for specific login request to resolve
	// TODO: wait for auth response
	await page.waitForResponse((res) => res.status() === 200);
	// await page.waitForLoadState('networkidle');
	// await page.waitForResponse(/\/api\/auth\/callback\/credentials/);
}
