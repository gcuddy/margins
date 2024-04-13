// import { validateEmailVerificationToken } from '$lib/auth/token.server';

// TODO: fix all this
export async function GET(event) {
	const { auth } = event.locals;
	console.log('email-verification/[token]/+server.ts', event.params.token);
	// try {
	// 	// TODO: should check to see if we're logged in as another user, and if so, throw an error
	// 	const userId = await validateEmailVerificationToken(event.params.token);
	// 	const user = await auth.getUser(userId);
	// 	await auth.invalidateAllUserSessions(user.userId);
	// 	await auth.updateUserAttributes(user.userId, {
	// 		email_verified: true, // `Number(true)` if stored as an integer
	// 	});
	// 	const session = await auth.createSession({
	// 		attributes: {},
	// 		userId: user.userId,
	// 	});
	// 	const sessionCookie = auth.createSessionCookie(session);
	// 	return new Response(null, {
	// 		headers: {
	// 			Location: '/', // profile page
	// 			'Set-Cookie': sessionCookie.serialize(),
	// 		},
	// 		status: 302,
	// 	});
	// } catch {
	// 	return new Response('Invalid email verification link', {
	// 		status: 400,
	// 	});
	// }
	return new Response();
}
