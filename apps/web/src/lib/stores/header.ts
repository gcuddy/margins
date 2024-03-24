import type HeaderSvelte from '$lib/components/layout/Header.svelte';
import type { ComponentProperties, StoredComponent, StoredComponentTyped } from '$lib/stores/types';
import { writable } from 'svelte/store';

interface HeaderComponent {
	props?: ComponentProperties<HeaderSvelte>;
	header: StoredComponent | string;
}

// again trying to get types to work but having trouble

function headerComponentCreator<T>() {
	const { subscribe, set, update } = writable<HeaderComponent>({
		props: {},
		header: 'Header'
	});

	// function set<T>(_component: StoredComponent | string, props) {
	// 	const component = typeof _component === 'string' ? _component : _component;
	// 	const props = typeof _component === 'string' ? {} : _component.props || {};
	// 	_set({
	// 		props,
	// 		component
	// 	});
	// }

	return {
		subscribe,
		set,
		update
	};
}

export const headerComponent = writable<HeaderComponent>({
	props: {},
	header: 'Header'
});
