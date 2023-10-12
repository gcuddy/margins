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

    const _id = numberOrString(id);

		const query = queryFactory.entries.detail({ id: _id, type });

	console.log({ query });
	const queryData = await queryClient.ensureQueryData({
		...query,
		meta: {
			init: event,
		},
	});

	console.log({ queryData });
	return {
		// component: module.default,
		...data,
		// cache,
		// ...queryData,
		...queryData,
		component: get_module(type).then((module) => module?.default),
		query,
		//
		id: _id,
		type,
	};
}) satisfies PageLoad;
