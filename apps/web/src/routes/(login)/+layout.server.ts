import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	console.log('login load');
	if (locals.user) {
		redirect(307, '/library/backlog');
	}
}
