import { validateEmailVerificationToken } from '$lib/auth/token.server';
import { auth } from '$lib/server/lucia';

// TODO: fix all this
export async function GET(event) {
	console.log('email-verification/[token]/+server.ts', event.params.token);
	try {
		// TODO: should check to see if we're logged in as another user, and if so, throw an error
		const userId = await validateEmailVerificationToken(event.params.token);
		const user = await auth.getUser(userId);
		await auth.invalidateAllUserSessions(user.userId);
		await auth.updateUserAttributes(user.userId, {
			email_verified: true, // `Number(true)` if stored as an integer
		});
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {},
		});
		const sessionCookie = auth.createSessionCookie(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/', // profile page
				'Set-Cookie': sessionCookie.serialize(),
			},
		});
	} catch {
		return new Response('Invalid email verification link', {
			status: 400,
		});
	}
}
