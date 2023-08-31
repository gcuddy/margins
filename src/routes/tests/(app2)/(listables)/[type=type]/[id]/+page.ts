import type { QueryClient } from '@tanstack/svelte-query';

import { queryFactory } from '$lib/queries/querykeys';
import type { Type } from '$lib/types';
import { numberOrString } from '$lib/utils/misc';

import type { PageLoad } from './$types';
import { get_module } from './module';

export const load = (async (event) => {
	const { parent, data } = event;
	const { id, type: _type } = event.params;
	const type = _type as Type;

	const parentData = await parent();

    const queryClient = parentData.queryClient as QueryClient;


	const query = queryFactory.entries.detail({ id: numberOrString(id), type });

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
		component: get_module(type).then((module) => module?.default ),
		query,
		type
	};
}) satisfies PageLoad
