import type { Status } from '@margins/db/kysely/enums';
import type { Command } from '@margins/features/commands';
import Inbox from 'lucide-svelte/icons/inbox';
import Star from 'lucide-svelte/icons/star';
import CircleDashed from 'lucide-svelte/icons/circle-dashed';
import type { ComponentType } from 'svelte';

export const locationToDisplay: Record<Status, string> = {
	Archive: 'Done',
	Backlog: 'Backlog',
	Now: 'Now',
} as const;

export const locationToIcon: Record<Status, ComponentType> = {
	Archive: Inbox,
	Backlog: CircleDashed,
	Now: Star,
};

export const locations: Status[] = ['Backlog', 'Now', 'Archive'] as const;

export const locationCommands = locations.map((location) => ({
	icon: locationToIcon[location],
	id: location,
	label: locationToDisplay[location],
})) satisfies Omit<Command, 'action'>[];
