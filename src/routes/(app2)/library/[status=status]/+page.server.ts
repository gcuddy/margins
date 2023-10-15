/* eslint-disable no-console */
import { error, redirect } from '@sveltejs/kit';

import { statusLookup, type Type, types } from '$lib/types';
import { handleLoginRedirect } from '$lib/utils/redirects';

import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const { fetch, locals, url } = event;
	// const session = await locals.auth.validate();
	// if (!session) {
	//     throw redirect(302, handleLoginRedirect(event));
	// }
	const status =
		event.params.status.toLowerCase() === 'all'
			? null
			: statusLookup[
					event.params.status.toLowerCase() as keyof typeof statusLookup
			  ];
	// if (!status) {
	//     // this shouldn't be the case given our param checker, bt just in case
	//     throw redirect(302, "/library/now");
	// }
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, handleLoginRedirect(event));
		throw error(401, 'Unauthorized');
	}

	event.depends('entries');
	// const userId = session.user.userId;

	const type = types.includes(url.searchParams.get('type') ?? '')
		? (url.searchParams.get('type') as Type)
		: undefined;

	// TODO: REMOVE THIS TESTING TESTING
	// const lib = await library({
	// 	filter: {
	// 		bookmark: {
	// 			status: 'Backlog',
	// 		},
	// 		title: {
	// 			contains: 'capital',
	// 		},
	// 	},
	// 	userId: session.user.userId,
	// });

	// console.log({ lib });

	return {
		Status: status,
		// userId: session.user.userId,
		// entries,
		// next,
		session,

		status: status
			? (status.toLocaleLowerCase() as keyof typeof statusLookup)
			: null,

		type,

		// get view preferences
		// TODO: review if we should put this into get_library query
	};
}) satisfies PageServerLoad;
