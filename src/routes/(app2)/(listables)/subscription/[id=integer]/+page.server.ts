import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { bulkEntriesSchema } from '$lib/schemas';
import { redirect } from '@sveltejs/kit';

export async function load({locals}) {
    const session = await locals.auth.validate();
    if (!session) throw redirect(303, '/login')
    return {
        bulkForm: superValidate(bulkEntriesSchema),
        session
    };
}
