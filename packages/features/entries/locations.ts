import type { Status } from '@margins/db/kysely/enums';
import type { Command } from '@margins/features/commands';
import { Archive, Circle, Star } from 'svelte-radix';
import type { ComponentType } from 'svelte';

export const locationToDisplay: Record<Status, string> = {
	Archive: 'Done',
	Backlog: 'Backlog',
	Now: 'Now',
} as const;

export const locationToIcon: Record<Status, ComponentType> = {
	Archive,
	Backlog: Circle,
	Now: Star,
};

export const locationToHrefs: Record<Status, string> = {
	Archive: '/archive',
	Backlog: '/backlog',
	Now: '/now',
};

export const locations: Status[] = ['Backlog', 'Now', 'Archive'] as const;

export const locationCommands = locations.map((location) => ({
	icon: locationToIcon[location],
	id: location,
	label: locationToDisplay[location],
})) satisfies Omit<Command, 'action'>[];
