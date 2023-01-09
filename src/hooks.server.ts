import { handleHooks } from '@lucia-auth/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

import { auth } from '$lib/server/lucia';
import { createContext } from '$lib/trpc/context';
import { appRouter } from '$lib/trpc/router';

export const handle: Handle = sequence(
	handleHooks(auth),
	createTRPCHandle({
		router: appRouter,
		createContext,
		responseMeta({ type, errors, ctx, paths }) {
			console.log(`TESTING RESPONSEMETA`)
			console.log({ paths })
			// see discussion https://github.com/icflorescu/trpc-sveltekit/issues/2
			// this example taken from trcrp website
			// assuming you have all your public routes with the keyword `public` in them
			const allPublic = paths && paths.every((path) => path.includes('public'));
			// checking that no procedures errored
			const allOk = errors.length === 0;
			// checking we're doing a query request
			const isQuery = type === 'query';
			const WILL_CACHE = allPublic && allOk && isQuery
			console.log({ WILL_CACHE })
			if (WILL_CACHE) {
				// cache request for 1 day + revalidate once every 5 seconds
				const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
				return {
					headers: {
						'cache-control': `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
					},
				};
			} else if (allOk && isQuery) {
				// should we still cache here just no stale-while revalidate?
				// return {
				// 	headers: {
				// 		'cache-control': `s-maxage=1, stale-while-revalidate`,

				// 	}
				// }
			}
			return {};
		},
	})
);
