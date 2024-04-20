import { redirect } from '@sveltejs/kit';

export async function GET({ locals }) {
	if (!locals.session || !locals.user) {
		redirect(302, '/login?chrome_ext=true');
	} else {
		redirect(
			302,
			'/login-success?sessionToken=' +
				locals.session.id +
				'&userID=' +
				locals.user.id,
		);
	}
}
