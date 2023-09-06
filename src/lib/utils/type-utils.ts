import type { Page } from '@melt-ui/svelte';
import type { Readable } from 'svelte/store';

import type { page } from '$app/stores';
import type { ConditionalPick } from 'type-fest';

/**
 * PickByValue
 * @desc From `T` pick a set of properties by value matching `ValueType`.
 * Credit: [Piotr Lewandowski](https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c)
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; };
 *
 *   // Expect: { req: number }
 *   type Props = PickByValue<Props, number>;
 *   // Expect: { req: number; reqUndef: number | undefined; }
 *   type Props = PickByValue<Props, number | undefined>;
 */
export type PickByValue<T, ValueType> = Pick<
	T,
	{ [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>;

export type Promiseable<T> = T | Promise<T>;

export type KeysThatBeginWith<T, Phrase extends string> = keyof {
	[K in keyof T as K extends `${Phrase}${infer R}` ? K : never]: T[K];
};

/**
 * Function to assert that a value is not null or undefined. Useful for Svelte syntax, which doesn't support ! operator.
 */
export function assert<T>(value: T): NonNullable<T> {
	if (!value) {
		throw new Error('Value is null or undefined');
	}
	return value;
}

export type ValueOf<T> = T[keyof T];

export type Maybe<T> = T | null | undefined;

// Type to unwrap value from store

export type StringsToObjWithKey<T extends string, TKey extends string> = {
	[K in TKey]: T;
};

type X = StringsToObjWithKey<'a' | 'b', 'name'>;

export type GetValueFromObj<
	T extends { [key: string]: any },
	TKey extends keyof T,
> = T[TKey];
export type ExtractUnionType<T, K extends keyof any> = T extends {
	[key in K]: infer U;
}
	? U
	: never;

export type DeepWriteable<T> = {
	-readonly [P in keyof T]: DeepWriteable<T[P]>;
};

export type TypeKeys<TObj extends object, TType> = keyof ConditionalPick<
	TObj,
	TType
>;
