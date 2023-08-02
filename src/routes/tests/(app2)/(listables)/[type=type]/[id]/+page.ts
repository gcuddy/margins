import type { ComponentType, SvelteComponent } from 'svelte';
import type { PageLoad } from './$types';
import { get_module } from './module';
import type { Type } from '$lib/types';
import { entryQuery } from './query';

export async function load(event) {
	const { parent } = event;
	const { id, type: _type } = event.params;
	const type = _type as Type;
	// const module = await get_module(type);
	// const component = module?.default as ComponentType | undefined;

	const { queryClient } = await parent();

	console.log({ queryClient, event });

	return {
		// component: module.default,
		...(await queryClient.ensureQueryData(entryQuery(event, { id, type }))),
		component: get_module(type).then((module) => module?.default as ComponentType | undefined)
	};
}
