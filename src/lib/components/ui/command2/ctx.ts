import { CommandProps, createCommandStore } from "./store";
import { getContext, setContext } from 'svelte';

const NAME = Symbol('command');
export const ctx = {
	set: <T>(props?: CommandProps<T>) => {
		const store = createCommandStore(props);
		setContext(NAME, store);
		return store;
	},
	get: () => {
		return getContext<ReturnType<typeof createCommandStore>>(NAME);
	}
};
