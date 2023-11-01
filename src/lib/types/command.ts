// command type, that can be used for Dropdown, Command, Dialog/Sheet for Mobile, etc.

import type { LibraryEntry } from '$lib/server/queries';
import type { ComponentType } from 'svelte';

type BaseCommand<TFilter = unknown> = {
	text: string;
	icon?: ComponentType;
	show?: boolean | ((data?: TFilter) => boolean);
};

type CommandWithAction<TFilter = unknown> = {
	action: (data?: TFilter) => void | (() => void);
	items?: never;
};

type CommandWithItems<TFilter = unknown> = {
	action?: never;
	items: Commands;
};

type Commands<TFilter = unknown> = {
	heading?: string;
	commands: Command<TFilter>[];
};

type CommandWithComponent = {};

export type Command<TFilter = unknown> = BaseCommand<TFilter> &
	(CommandWithAction<TFilter> | CommandWithItems<TFilter>);
