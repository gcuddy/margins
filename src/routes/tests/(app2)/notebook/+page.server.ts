import { db } from "$lib/db";
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { annotations as $annotation, withEntry } from "$lib/db/selects";
import { getNotebook } from "$lib/queries/server";

export const load = (async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) throw redirect(303, '//login');

    return {
        session,
        // notes: getNotebook({
        //     userId: session.user.userId,
        //     // cursor
        // })
    };
}) satisfies PageServerLoad;
