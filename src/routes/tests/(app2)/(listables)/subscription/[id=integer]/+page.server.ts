import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { bulkEntriesSchema } from '$lib/schemas';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    const session = await locals.validate();
    if (!session) throw redirect(303, '/login')
    return {
        bulkForm: superValidate(bulkEntriesSchema),
        session
    };
}) satisfies PageServerLoad;