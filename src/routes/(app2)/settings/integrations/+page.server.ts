import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const session = locals.session;
	if (!session) {
		redirect(301, '/login');
	}

	return {
		title: 'Integrations',
	};
}
