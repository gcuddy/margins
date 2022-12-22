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
		responseMeta({ type, errors }) {
			// see discussion https://github.com/icflorescu/trpc-sveltekit/issues/2 -> does this happen everywhere?
			if (type === 'query' && errors.length === 0) {
				const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
				// I think this is right?
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
