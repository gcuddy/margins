import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	console.log('login load');
	if (locals.user) {
		if (locals.user.username) {
			return redirect(307, `/u:${locals.user.username}`);
		}
	}
}
