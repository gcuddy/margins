import { generateEmailVerificationToken } from '$lib/auth/token';
import { sendEmailVerificationLink } from '$lib/auth/verification';
import { auth } from '$lib/server/lucia';

export async function POST(event) {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();
	if (!session) {
		return new Response(null, {
			status: 401,
		});
	}
	if (session.user.emailVerified) {
		// email already verified
		return new Response(null, {
			status: 422,
		});
	}
	try {
		const token = await generateEmailVerificationToken(session.user.userId);
		await sendEmailVerificationLink(session.user.email, token);
		return new Response();
	} catch {
		return new Response('An unknown error occurred', {
			status: 500,
		});
	}
}
