import type { QueryClient } from '@tanstack/svelte-query';

import { queryFactory } from '$lib/queries/querykeys';
import type { Type } from '$lib/types';
import { numberOrString } from '$lib/utils/misc';

import type { PageLoad } from './$types';
import { get_module } from './module';
import { writable } from 'svelte/store';

import { superValidate } from 'sveltekit-superforms/client';
import { interactionLogInputSchema } from '$components/entries/interaction-form/schema';

export const load = (async (event) => {
	const { parent, data } = event;
	const { id, type: _type } = event.params;
	const type = _type as Type;

	event.depends('entry');

	const parentData = await parent();

	const queryClient = parentData.queryClient as QueryClient;

	const _id = numberOrString(id);

	const query = queryFactory.entries.detail({ id: _id, type });

	console.log({ query });

	const queryData = await queryClient.ensureQueryData({
		...query,
		meta: { init: event },
	});

	const logInteractionForm = superValidate(
		{
			entryId: id,
			type: type,
			revisit: !!queryData?.entry?.interactions?.length,
			rating: queryData?.entry?.bookmark?.rating ?? undefined,
		},
		interactionLogInputSchema,
	);
	return {
		// component: module.default,
		...data,
		...queryData,
		queryData,
		// cache,
		// ...queryData,
		// ...queryData,
		component: get_module(type).then((module) => module?.default),
		logInteractionForm,
		query,
		queryKey: writable(query.queryKey),
		//
		id: _id,
		type,
	};
}) satisfies PageLoad;
