import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';

import type { CommandProps } from './store';
import type { PageType } from './utils';

type Unstyled = {
	unstyled?: boolean;
};

type HTMLDivAttributes = HTMLAttributes<HTMLDivElement>;
type DivProps = HTMLDivAttributes & Unstyled;

type InputProps = HTMLInputAttributes &
	Unstyled & {
		onKeydown?: (e: KeyboardEvent) => void;
	};

type ElProps<T extends EventTarget> = HTMLAttributes<T> & Unstyled;

type AsChild = {
	asChild?: boolean;
};

type RootProps = HTMLDivAttributes & AsChild & Unstyled;

type SingleValue<T> = {
	multiple?: false;
	value?: T;
};

type MultipleValue<T> = {
	multiple: true;
	value?: Array<T>;
};

type SingleOrMultipleValue<T> = SingleValue<T> | MultipleValue<T>;

type RootCommandProps<TType, TPages extends PageType> = RootProps & {
	bounce?: boolean;
	initialPages?: Array<TPages>;
	pages?: Array<TPages>;
	// multiple?: boolean;
	// value?: T[];
	/**
	 * Prop to pass in a value that represents the generic type. Doesn't do anything beyond that.
	 */
	type?: TType;
} & SingleOrMultipleValue<TType> &
	Omit<CommandProps<TType>, 'multiple'>;

export type {
	AsChild,
	DivProps,
	ElProps,
	InputProps,
	PageType,
	RootCommandProps,
	RootProps,
};
