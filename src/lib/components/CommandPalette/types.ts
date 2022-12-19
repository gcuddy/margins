import type { IconName } from '$lib/icons';
import type { ShortcutKey } from '$lib/types/keyboard';
import type { Page } from '@sveltejs/kit';
import type { User } from 'lucia-auth';
export interface Command {
	id: string;
	name: string;
	subtitle?: string;
	icon: IconName; // make this icon name — actually make this same as menu items, sidebar, etc — have an Iconname and iconprops type
	keywords?: string;
	group?: string;
	perform: ({ page, user }: { page: Page; user?: User }) => void;
	/* If check is false, the command won't show */
	check?: () => boolean;
	kbd?: ShortcutKey[][]; // e.g. [ [ 'ctrl', 'c' ], [ 'shift', 'c' ] ]
}
