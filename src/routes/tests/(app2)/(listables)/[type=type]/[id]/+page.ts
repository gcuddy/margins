import type { ComponentType } from 'svelte';

import { browser } from '$app/environment';
import { queryFactory } from '$lib/queries/querykeys';
import type { Type } from '$lib/types';
import { numberOrString } from '$lib/utils/misc';

import { get_module } from './module';

export async function load(event) {
	const { parent, data } = event;
	const { id, type: _type } = event.params;
	const type = _type as Type;
	// const module = await get_module(type);
	// const component = module?.default as ComponentType | undefined;

	const { queryClient } = await parent();

	console.log({ queryClient, event });

	const query = queryFactory.entries.detail({ id: numberOrString(id), type });

	// const cache = queryClient.getQueryCache().find(query);

	// if (!cache) {
	//     await queryClient.prefetchQuery({
	//         ...query,
	//         meta: {
	//             init: event
	//         }
	//     });
	// }

	console.dir({ query }, { depth: null });
    // if
	// const queryData = await queryClient.ensureQueryData({
	// 	...query,
	// 	meta: {
	// 		init: event
	// 	}
	// });
	return {
		// component: module.default,
		...data,
		// cache,
		// ...queryData,
        ...(/*browser ? {} : */await queryClient.ensureQueryData({
            ...query,
            meta: {
                init: event
            }
        })),
		type,
		query,
		component: get_module(type).then((module) => module?.default )
	};
}

// function query<T extends CreateQueryOptions>(opts: T, queryClient: QueryClient) {
//     const cache = queryClient.getQueryCache().find(opts.queryKey);
//     if (cache) {
//         await queryClient.prefetchQuery(opts);
//     }

//     // return () =>
// }
