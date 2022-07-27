import type { IconName } from '$lib/icons';
import type { ShortcutKey } from '$lib/types/keyboard';

export interface Command {
	id: string;
	name: string;
	subtitle?: string;
	icon: IconName; // make this icon name — actually make this same as menu items, sidebar, etc — have an Iconname and iconprops type
	keywords?: string;
	group?: string;
	perform: () => void;
	/* If check is false, the command won't show */
	check?: () => boolean;
	kbd?: ShortcutKey[][]; // e.g. [ [ 'ctrl', 'c' ], [ 'shift', 'c' ] ]
}
