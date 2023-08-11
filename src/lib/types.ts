import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import { z } from 'zod';

export const types = [
	// "entry",
	'movie',
	'book',
	'article',
	'podcast',
	'tv',
	'tweet',
	'video',
	'album',
	'pdf'
] as const;

export type Type = typeof types[number];

export const typeSchema = z.enum(types);

export type Message = { status: 'error' | 'success'; text: string };

export const status = ['Now', 'Backlog', 'Archive'] as const;

export const number_operands = ['>', '<', '=', '<=', '>='] as const;

export const number_operand_lookup = {
	'>': 'greater than',
	'<': 'less than',
	'=': 'equal to',
	'<=': 'less than or equal to',
	'>=': 'greater than or equal to'
} as const;

export const statusLookup = {
	backlog: 'Backlog',
	now: 'Now',
	archive: 'Archive'
} as const;

export type StoredComponent<T extends SvelteComponent> = {
	component: ComponentType<T>;
	props: ComponentProps<T>;
};

export type Command = {
	id: string;
	name: string;
	subtitle?: string;
	// icon: ComponentType | StoredComponent;
};

function createCommands() {}

// desired api

// const config = [{}]

export type StoreValue<T> = T extends { subscribe(cb: (value: infer V) => void): void } ? V : never;

export type BaseMenuItem<T extends SvelteComponent = any> = {
	name: string;
	action?: () => void;
	href?: string;
	kbd?: string;
	disabled?: boolean;
} & IconComponent<T>;

export type IconComponent<T extends SvelteComponent> =
	| {
			icon: ComponentType<T>;
			props?: ComponentProps<T>;
	  }
	| {
			icon?: undefined;
			props?: never;
	  };
