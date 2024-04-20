import { redirect } from '@sveltejs/kit';

export async function GET({ locals }) {
	if (!locals.session) {
		redirect(302, '/login?chrome_ext=true');
	} else {
		redirect(302, '/login-success?sessionToken=' + locals.session.id);
	}
}
