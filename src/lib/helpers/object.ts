import type { DeepWriteable, ValueOf } from '$lib/utils/type-utils';

export function omit<T extends Record<string, unknown>, K extends keyof T>(
	obj: T,
	...keys: Array<K>
): Omit<T, K> {
	const result = {} as Omit<T, K>;
	for (const key of Object.keys(obj)) {
		if (!keys.includes(key as unknown as K)) {
			result[key as keyof Omit<T, K>] = obj[key] as ValueOf<Omit<T, K>>;
		}
	}
	return result;
}

function isRegExp(value: unknown): value is RegExp {
	return value instanceof RegExp;
}

/**
 * Taken from Melt-UI
 * The fastest deep equal with ES6 Map, Set and Typed arrays support.
 * Adapted from the `fast-deep-equal` npm package.
 *
 * @see https://github.com/epoberezkin/fast-deep-equal#readme
 */
export function deepEqual(a: unknown, b: unknown) {
	if (a === b) {
		return true;
	}

	if (a && b && typeof a == 'object' && typeof b == 'object') {
		if (a.constructor !== b.constructor) {
			return false;
		}

		let length, i;

		if (Array.isArray(a)) {
			length = a.length;
			if (!Array.isArray(b) || length != b.length) {
				return false;
			}
			for (i = length; i-- !== 0; ) {
				if (!deepEqual(a[i], b[i])) {
					return false;
				}
			}
			return true;
		}

		if (isRegExp(a)) {
			return isRegExp(b) && a.source === b.source && a.flags === b.flags;
		}
		if (a.valueOf !== Object.prototype.valueOf) {
			return a.valueOf() === b.valueOf();
		}
		if (a.toString !== Object.prototype.toString) {
			return a.toString() === b.toString();
		}

		const keys = Object.keys(a);
		length = keys.length;
		if (length !== Object.keys(b).length) {
			return false;
		}

		for (i = length; i-- !== 0; ) {
			if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
				return false;
			}
		}

		for (i = length; i-- !== 0; ) {
			const key = keys[i];

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (!deepEqual((a as any)[key], (b as any)[key])) {
				return false;
			}
		}

		return true;
	}

	// true if both NaN, false otherwise
	return a !== a && b !== b;
}

export function concatenateValues(obj: unknown): string {
	if (typeof obj === 'object' && obj !== null) {
		return Array.isArray(obj)
			? obj.map((item) => concatenateValues(item)).join('')
			: Object.values(obj)
					.map((value) => concatenateValues(value))
					.join('');
	} else if (
		typeof obj === 'string' ||
		typeof obj === 'number' ||
		typeof obj === 'boolean'
	) {
		return String(obj);
	} else {
		return '';
	}
}

export const deepWriteable = <T>(obj: T): DeepWriteable<T> => {
	return obj as DeepWriteable<T>;
};

/**
 * Takes an object and converts all of its values to strings.
 */
export function objectValuesToString(
	obj: Record<string, unknown>,
): Record<string, string> {
	const result: Record<string, string> = {};
	for (const [key, value] of Object.entries(obj)) {
		result[key] = String(value);
	}
	return result;
}

/**
 * Like Object.keys, but unsound in exchange for more convenience.
 *
 * Casts the result of Object.keys to the known keys of an object type,
 * even though JavaScript objects may contain additional keys.
 *
 * Only use this function when you know/control the provenance of the object
 * you're iterating, and can verify it contains exactly the keys declared
 * to the type system.
 *
 * Example:
 * ```
 * const o = {x: "ok", y: 10}
 * o["z"] = "UNTRACKED_KEY"
 * const safeKeys = Object.keys(o)
 * const unsafeKeys = objectKeys(o)
 * ```
 * => const safeKeys: string[]
 * => const unsafeKeys: ("x" | "y")[] // Missing "z"
 */
export const objectKeys = Object.keys as <T>(obj: T) => Array<keyof T>;

/**
 * The type of a single item in `Object.entries<T>(value: T)`.
 *
 * Example:
 * ```
 * interface T {x: string; y: number}
 * type T2 = ObjectEntry<T>
 * ```
 * => type T2 = ["x", string] | ["y", number]
 */
export type ObjectEntry<T> = {
	// Without Exclude<keyof T, undefined>, this type produces `ExpectedEntries | undefined`
	// if T has any optional keys.
	[K in Exclude<keyof T, undefined>]: [K, T[K]];
}[Exclude<keyof T, undefined>];

/**
 * Like Object.entries, but returns a more specific type which can be less safe.
 *
 * Example:
 * ```
 * const o = {x: "ok", y: 10}
 * const unsafeEntries = Object.entries(o)
 * const safeEntries = objectEntries(o)
 * ```
 * => const unsafeEntries: [string, string | number][]
 * => const safeEntries: ObjectEntry<{
 *   x: string;
 *   y: number;
 * }>[]
 *
 * See `ObjectEntry` above.
 *
 * Note that Object.entries collapses all possible values into a single union
 * while objectEntries results in a union of 2-tuples.
 */
export const objectEntries = Object.entries as <T>(
	o: T,
) => Array<ObjectEntry<T>>;

/**
 * via https://github.com/antfu/utils/blob/main/src/object.ts
 * Create a new subset object by giving keys
 *
 * @category Object
 */
export function objectPick<O extends object, T extends keyof O>(
	obj: O,
	keys: Array<T>,
	omitUndefined = false,
) {
	return keys.reduce(
		(n, k) => {
			if (k in obj) {
				if (!omitUndefined || obj[k] !== undefined) {
					n[k] = obj[k];
				}
			}
			return n;
		},
		{} as Pick<O, T>,
	);
}

// Copied from: https://github.com/jonschlinkert/is-plain-object
export function isPlainObject(o: any) {
	if (!hasObjectPrototype(o)) {
		return false;
	}

	// If has modified constructor
	const ctor = o.constructor;
	if (typeof ctor === 'undefined') {
		return true;
	}

	// If has modified prototype
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) {
		return false;
	}

	// If constructor does not have an Object-specific method
	if (!prot.hasOwnProperty('isPrototypeOf')) {
		return false;
	}

	// Most likely a plain Object
	return true;
}

function hasObjectPrototype(o: any) {
	return Object.prototype.toString.call(o) === '[object Object]';
}

// Copied from: https://github.dev/tanstack/router
export function partialDeepEqual(a: any, b: any): boolean {
	if (a === b) {
		return true;
	}

	if (typeof a !== typeof b) {
		return false;
	}

	if (isPlainObject(a) && isPlainObject(b)) {
		return !Object.keys(b).some((key) => !partialDeepEqual(a[key], b[key]));
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		return (
			a.length === b.length &&
			a.every((item, index) => partialDeepEqual(item, b[index]))
		);
	}

	return false;
}

/**
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between immutable JSON values for example.
 * Do not use this with signals
 */
export function replaceEqualDeep<T>(prev: any, _next: T): T {
	if (prev === _next) {
		return prev;
	}

	const next = _next as any;

	const array = Array.isArray(prev) && Array.isArray(next);

	if (array || (isPlainObject(prev) && isPlainObject(next))) {
		const prevSize = array ? prev.length : Object.keys(prev).length;
		const nextItems = array ? next : Object.keys(next);
		const nextSize = nextItems.length;
		const copy: any = array ? [] : {};

		let equalItems = 0;

		for (let i = 0; i < nextSize; i++) {
			const key = array ? i : nextItems[i];
			copy[key] = replaceEqualDeep(prev[key], next[key]);
			if (copy[key] === prev[key]) {
				equalItems++;
			}
		}

		return prevSize === nextSize && equalItems === prevSize ? prev : copy;
	}

	return next;
}

export function coalesceObjects<T extends Record<string, unknown> | null>(
	...objects: Array<T>
): T | null {
	console.log('coalesceObjects', objects);
	return objects.find((obj) => obj && Object.keys(obj).length > 0) || null;
}
