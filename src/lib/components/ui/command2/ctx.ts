import { getContext, setContext } from 'svelte';

import { type CommandProps, createCommandStore } from './store';

const NAME = Symbol('command');
export const ctx = {
	get: <TValue = unknown>() => {
		return getContext<ReturnType<typeof createCommandStore<TValue>>>(NAME);
	},
	set: <TValue>(props?: CommandProps<TValue>) => {
		const store = createCommandStore(props);
		setContext(NAME, store);
		return store;
	},
};
