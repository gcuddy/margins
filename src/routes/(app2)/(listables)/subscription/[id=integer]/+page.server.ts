import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { bulkEntriesSchema } from '$lib/schemas';
import { redirect } from '@sveltejs/kit';
import { loginRedirect } from '$lib/utils/redirects';

export async function load(event) {
	const session = await event.locals.auth.validate();
	if (!session) throw loginRedirect(event);
	return {
		bulkForm: superValidate(bulkEntriesSchema),
		session,
	};
}
