import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { entrySelect } from '$lib/db/selects';

export async function load({ params, locals }) {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/login');
	}

	const entries = await db
		.selectFrom('Entry as e')
		.where('uri', 'like', `%${params.domain}%`)
		.select(entrySelect)
		.execute();

	return { entries };
}
