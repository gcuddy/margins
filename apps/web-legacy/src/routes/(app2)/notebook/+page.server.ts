import { db } from "$lib/db";
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { annotations as $annotation, withEntry } from "$lib/db/selects";
import { getNotebook } from "$lib/queries/server";
import { loginRedirect } from '$lib/utils/redirects';

export const load = (async (event) => {
	const { locals } = event;
	const session = locals.session;
	if (!session) throw loginRedirect(event);

	return {
		session,
		// notes: getNotebook({
		//     userId: session.user.userId,
		//     // cursor
		// })
	};
}) satisfies PageServerLoad;
