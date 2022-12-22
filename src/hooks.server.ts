import { handleHooks } from '@lucia-auth/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

import { auth } from '$lib/server/lucia';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';

export const handle: Handle = sequence(
	handleHooks(auth),
	createTRPCHandle({
		router,
		createContext,
		responseMeta({ type, errors, ctx, paths }) {
			console.log({paths})
			// see discussion https://github.com/icflorescu/trpc-sveltekit/issues/2
			// this example taken from trcrp website
			// assuming you have all your public routes with the keyword `public` in them
			const allPublic = paths && paths.every((path) => path.includes('public'));
			// checking that no procedures errored
			const allOk = errors.length === 0;
			// checking we're doing a query request
			const isQuery = type === 'query';
			if (allPublic && allOk && isQuery) {
			  // cache request for 1 day + revalidate once every second
			  const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
			  return {
				headers: {
				  'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
				},
			  };
			}
			return {};
		},
	})
);
