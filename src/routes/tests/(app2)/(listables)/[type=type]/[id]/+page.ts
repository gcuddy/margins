import { queryFactory } from '$lib/queries/querykeys';
import type { Type } from '$lib/types';
import type { ComponentType } from 'svelte';
import { get_module } from './module';
import { numberOrString } from '$lib/utils/misc';

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
	const queryData = await queryClient.ensureQueryData({
		...query,
		meta: {
			init: event
		}
	});
	return {
		// component: module.default,
		...data,
		// cache,
		...queryData,
		type,
		query,
		component: get_module(type).then((module) => module?.default as ComponentType | undefined)
	};
}

// function query<T extends CreateQueryOptions>(opts: T, queryClient: QueryClient) {
//     const cache = queryClient.getQueryCache().find(opts.queryKey);
//     if (cache) {
//         await queryClient.prefetchQuery(opts);
//     }

//     // return () =>
// }
