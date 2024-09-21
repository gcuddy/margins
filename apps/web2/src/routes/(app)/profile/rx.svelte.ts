import * as Registry from '@effect-rx/rx/Registry';
import type * as Rx from '@effect-rx/rx/Rx';
import type * as RxRef from '@effect-rx/rx/RxRef';
import { globalValue } from 'effect/GlobalValue';
import { getContext, onDestroy, setContext } from 'svelte';
/**
 * @since 1.0.0
 * @category modules
 */
export * as Registry from '@effect-rx/rx/Registry';
/**
 * @since 1.0.0
 * @category modules
 */
export * as Result from '@effect-rx/rx/Result';
/**
 * @since 1.0.0
 * @category modules
 */
export * as Rx from '@effect-rx/rx/Rx';
/**
 * @since 1.0.0
 * @category modules
 */
export * as RxRef from '@effect-rx/rx/RxRef';

/**
 * @since 1.0.0
 * @category registry
 */
export const registryKey = Registry.TypeId;

/**
 * @since 1.0.0
 * @category registry
 */
export const defaultRegistry: Registry.Registry = globalValue('@effect-rx/rx-svelte/defaultRegistry', () =>
	Registry.make()
);

/**
 * @since 1.0.0
 * @category registry
 */
export const getRegistry = (): Registry.Registry => {
	return getContext(registryKey) ?? defaultRegistry;
};

/**
 * @since 1.0.0
 * @category registry
 */
export const setRegistry = (registry: Registry.Registry) => {
	setContext(registryKey, registry);
};

/**
 * @since 1.0.0
 * @category composables
 */
export const useRx = <R, W>(rx: Rx.Writable<R, W>) => {
	const registry = getRegistry();
	let value = $state<R>(registry.get(rx));

	const cancel = registry.subscribe(rx, (nextValue) => {
		value = nextValue;
	});

	onDestroy(cancel);

	const set = (_: W) => registry.set(rx, _);

	return [value, set] as const;
};

/**
 * @since 1.0.0
 * @category composables
 */
export const useRxValue = <A>(rx: Rx.Rx<A>): Readonly<A> => {
	const registry = getRegistry();
	let value = $state<A>(registry.get(rx));
	$effect(() =>
		registry.subscribe(rx, (nextValue) => {
			value = nextValue;
		})
	);
	return value as Readonly<A>;
};

/**
 * @since 1.0.0
 * @category composables
 */
export const useRxSet = <R, W>(rx: Rx.Writable<R, W>): ((_: W) => void) => {
	const registry = getRegistry();
	const cancel = registry.mount(rx);
	onDestroy(cancel);
	return (_) => registry.set(rx, _);
};

/**
 * @since 1.0.0
 * @category composables
 */
export const useRxRef = <A>(rxRef: RxRef.ReadonlyRef<A>): Readonly<A> => {
	let value = $state<A>(rxRef.value);
	const cancel = rxRef.subscribe((nextValue) => {
		value = nextValue;
	});
	onDestroy(cancel);
	return value;
};
