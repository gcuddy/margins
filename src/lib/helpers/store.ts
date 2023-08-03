import { onDestroy } from 'svelte';
import type { Action } from 'svelte/action';
import { derived, type Readable, type Subscriber, type Unsubscriber } from 'svelte/store';
import { isBrowser, isHTMLElement, noop } from '.';

// All taken from  https://github.dev/melt-ui/melt-ui/blob/develop/src/lib/internal/helpers/store.ts
// (maybe just export from there, here for vendoring)
export function getElementByMeltId(id: string) {
	if (!isBrowser) return null;
	const el = document.querySelector(`[data-melt-id="${id}"]`);
	return isHTMLElement(el) ? el : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

/** One or more values from `Readable` stores. */
type StoresValues<T> = T extends Readable<infer U>
	? U
	: {
			[K in keyof T]: T[K] extends Readable<infer U> ? U : never;
	  };

export function typedDerived<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>) => T
): Readable<ReturnType<typeof fn>> {
	return derived(stores, fn);
}

/**
 * A utility function that creates a derived store that automatically
 * unsubscribes from its dependencies.
 *
 * @template S - The type of the stores object
 * @template T - The type of the derived store
 * @param stores - The stores object to derive from
 * @param fn - The function to derive the store from
 * @returns A derived store that automatically unsubscribes from its dependencies
 */
export function derivedWithUnsubscribe<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>, onUnsubscribe: (cb: () => void) => void) => T
): Readable<T> {
	let unsubscribers: (() => void)[] = [];
	const onUnsubscribe = (cb: () => void) => {
		unsubscribers.push(cb);
	};

	const unsubscribe = () => {
		// Call all of the unsubscribe functions from the previous run of the function
		unsubscribers.forEach((fn) => fn());
		// Clear the list of unsubscribe functions
		unsubscribers = [];
	};

	const derivedStore = derived(stores, ($storeValues) => {
		unsubscribe();
		return fn($storeValues, onUnsubscribe);
	});

	onDestroy(unsubscribe);

	return derivedStore;
}

/**
 * A utility function that creates an effect from a set of stores and a function.
 * The effect is automatically cleaned up when the component is destroyed.
 *
 * @template S - The type of the stores object
 * @param stores - The stores object to derive from
 * @param fn - The function to run when the stores change
 * @returns A function that can be used to unsubscribe the effect
 */
export function effect<S extends Stores>(
	stores: S,
	fn: (values: StoresValues<S>) => (() => void) | void
): () => void {
	// Create a derived store that contains the stores object and an onUnsubscribe function
	const unsub = derivedWithUnsubscribe(stores, (stores, onUnsubscribe) => {
		return {
			stores,
			onUnsubscribe,
		};
	}).subscribe(({ stores, onUnsubscribe }) => {
		const returned = fn(stores);
		// If the function returns a cleanup function, call it when the effect is unsubscribed
		if (returned) {
			onUnsubscribe(returned);
		}
	});

	// Automatically unsubscribe the effect when the component is destroyed
	onDestroy(unsub);
	return unsub;
}

export const hiddenAction = <T extends Record<string, unknown>>(obj: T) => {
	return new Proxy(obj, {
		get(target, prop, receiver) {
			return Reflect.get(target, prop, receiver);
		},
		ownKeys(target) {
			return Reflect.ownKeys(target).filter((key) => key !== 'action');
		},
	});
};

export function lightable<T>(value: T): Readable<T> {
	function subscribe(run: Subscriber<T>): Unsubscriber {
		run(value);
		return () => {
			// don't need to unsub from anything
		};
	}
	return { subscribe };
}

type BuilderCallback<S extends Stores | undefined> = S extends Stores
	? // eslint-disable-next-line @typescript-eslint/no-explicit-any
	  (values: StoresValues<S>) => Record<string, any> | ((...args: any[]) => Record<string, any>)
	: // eslint-disable-next-line @typescript-eslint/no-explicit-any
	  () => Record<string, any> | ((...args: any[]) => Record<string, any>);

const isFunctionWithParams = (
	fn: unknown
): fn is (...args: unknown[]) => Record<string, unknown> => {
	return typeof fn === 'function';
};

type BuilderArgs<
	S extends Stores | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends BuilderCallback<S>
> = {
	stores?: S;
	action?: A;
	returned?: R;
};

type BuilderStore<
	S extends Stores | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends BuilderCallback<S>,
	Name extends string
> = Readable<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ReturnType<R> extends (...args: any) => any
		? ((
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore - This is a valid type, but TS doesn't like it for some reason. TODO: Figure out why
				...args: Parameters<ReturnType<R>>
		  ) => ReturnType<R> & { [K in `data-melt-${Name}`]: '' } & { action: A }) & { action: A }
		: ReturnType<R> & { [K in `data-melt-${Name}`]: '' } & { action: A }
>;

export function builder<
	S extends Stores | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends BuilderCallback<S>,
	Name extends string
>(name: Name, args?: BuilderArgs<S, A, R>): ExplicitBuilderReturn<S, A, R, Name> {
	const { stores, action, returned } = args ?? {};

	const derivedStore = (() => {
		if (stores && returned) {
			// If stores are provided, create a derived store from them
			return derived(stores, (values) => {
				const result = returned(values);
				if (isFunctionWithParams(result)) {
					const fn = (...args: Parameters<typeof result>) => {
						return hiddenAction({
							...result(...args),
							[`data-melt-${name}`]: '',
							action: action ?? noop,
						});
					};
					fn.action = action ?? noop;
					return fn;
				}

				return hiddenAction({
					...result,
					[`data-melt-${name}`]: '',
					action: action ?? noop,
				});
			});
		} else {
			// If stores are not provided, return a lightable store, for consistency
			const returnedFn = returned as (() => R) | undefined;
			const result = returnedFn?.();

			if (isFunctionWithParams(result)) {
				const resultFn = (...args: Parameters<typeof result>) => {
					return hiddenAction({
						...result(...args),
						[`data-melt-${name}`]: '',
						action: action ?? noop,
					});
				};
				resultFn.action = action ?? noop;

				return lightable(resultFn);
			}

			return lightable(
				hiddenAction({
					...result,
					[`data-melt-${name}`]: '',
					action: action ?? noop,
				})
			);
		}
	})() as BuilderStore<S, A, R, Name>;

	const actionFn = (action ??
		(() => {
			/** noop */
		})) as A & { subscribe: typeof derivedStore.subscribe };
	actionFn.subscribe = derivedStore.subscribe;

	return actionFn;
}

export type ExplicitBuilderReturn<
	S extends Stores | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends BuilderCallback<S>,
	Name extends string
> = BuilderStore<S, A, R, Name> & A;

export function createElHelpers<Part extends string = string>(prefix: string) {
	const name = (part?: Part) => (part ? `${prefix}-${part}` : prefix);
	const attribute = (part?: Part) => `data-melt-${prefix}${part ? `-${part}` : ''}`;
	const selector = (part?: Part) => `[data-melt-${prefix}${part ? `-${part}` : ''}]`;
	const getEl = (part?: Part) => document.querySelector(selector(part));

	return {
		name,
		attribute,
		selector,
		getEl,
	};
}
