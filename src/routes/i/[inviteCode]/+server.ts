// import { createMessage } from '$lib/types/forms';
import { redirect } from 'sveltekit-flash-message/server';

// just a helper to redirect to signup page
export async function GET(event) {
	throw redirect(
		303,
		`/signup?inviteCode=${event.params.inviteCode}`,
		// createMessage({
		// 	status: 'info',
		// 	text: 'Your invite code has been applied! Just enter an email, username, and password to sign up.',
		// }),
		// event,
	);
}
