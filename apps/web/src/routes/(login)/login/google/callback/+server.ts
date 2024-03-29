import { OAuth2RequestError } from 'arctic';
import { google } from '@margins/auth/oauth';
import { z } from 'zod';
import { db } from '@margins/db';
import { auth } from '@margins/auth';
import { generateId } from 'lucia';
import { redirectToUser } from '$lib/server/utils';

const googleUserSchema = z.object({
	email: z.string(),
	email_verified: z.boolean(),
	locale: z.string(),
	name: z.string(),
	picture: z.string(),
	sub: z.string(),
});

export async function GET(event) {
	console.log('login/google/callback');
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const storedCodeVerifier = event.cookies.get('google_oauth_code_verifier');

	console.log({
		code,
		state,
		storedCodeVerifier,
		storedState,
	});

	if (
		!code ||
		!state ||
		!storedState ||
		!storedCodeVerifier ||
		state !== storedState
	) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(
			code,
			storedCodeVerifier,
		);
		const googleUserResponse = await fetch(
			'https://openidconnect.googleapis.com/v1/userinfo',
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`,
				},
			},
		);

		const googleUser = googleUserSchema
			.passthrough()
			.parse(await googleUserResponse.json());

		if (!googleUser.email_verified) {
			return new Response(null, {
				status: 400,
			});
		}

		// TODO: should we join oauth account with user here?
		const existingUser = await db
			.selectFrom('user')
			.selectAll()
			.where('email', '=', googleUser.email)
			.executeTakeFirst();

		if (existingUser?.email_verified === 0) {
			// User exists but email is not verified...
			// TODO: is the right thing to do here?
			return new Response('Please verify your existing email first.', {
				status: 400,
			});
		}

		let username: string | null = null;

		if (existingUser) {
			username = existingUser.username;
			// User exists, add oauth connection
			await db
				.insertInto('oauth_account')
				.values({
					provider_id: 'google',
					provider_user_id: googleUser.sub,
					user_id: existingUser.id,
				})
				.ignore()
				.execute();

			const session = await auth.createSession(existingUser.id, {});
			const sessionCookie = auth.createSessionCookie(session.id);

			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
		} else {
			const userId = generateId(15);
			await db.transaction().execute(async (trx) => {
				await trx
					.insertInto('user')
					.values({
						email: googleUser.email,
						email_verified: 1,
						id: userId,
						updatedAt: new Date(),
					})
					.execute();

				return await trx
					.insertInto('oauth_account')
					.values({
						provider_id: 'google',
						provider_user_id: googleUser.sub,
						user_id: userId,
					})
					.execute();
			});

			const session = await auth.createSession(userId, {});
			const sessionCookie = auth.createSessionCookie(session.id);

			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
		}

		return new Response(null, {
			headers: {
				location: redirectToUser({ username }),
			},
			status: 302,
		});
	} catch (e) {
		console.error(e);
		if (e instanceof OAuth2RequestError) {
			// const { request, message, description } = e;
			return new Response(null, {
				status: 400,
			});
		}
		return new Response(null, {
			status: 500,
		});
	}
}
