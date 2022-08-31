import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, fetch }) => {
	const { lucia } = await parent();
	if (!lucia) throw redirect(302, '/login');
	const res = await fetch('/api/fetch_user_data', {
		headers: {
			Authorization: `Bearer ${lucia.access_token}`,
		},
	});
	return {
		user: await res.json(),
	};
};
