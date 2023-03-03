import { z } from 'zod';

import type { IconName } from '$lib/icons';

export const LOCATIONS = ['inbox', 'soon', 'later', 'archive'] as const;
export const LOCATIONS_WITH_ALL = ['inbox', 'soon', 'later', 'archive', 'all'] as const;

export const LOCATION_TO_DISPLAY = {
	inbox: 'Inbox',
	soon: 'Soon',
	later: 'Later',
	archive: 'Archive',
	all: 'All',
} as const;

export const LOCATION_LIST = LOCATIONS.map((location) => ({
	name: LOCATION_TO_DISPLAY[location],
	id: location,
}));

export const LOCATION_TO_ICON_SOLID: Record<Location | 'all', IconName> = {
	inbox: 'inboxSolid',
	soon: 'sparklesSolid',
	later: 'calendarSolid',
	archive: 'archiveSolid',
	all: 'inboxStackMini',
};
export const LOCATION_TO_ICON_OUTLINE: Record<Location, IconName> = {
	inbox: 'inbox',
	soon: 'sparkles',
	later: 'calendar',
	archive: 'archive',
};

export const LocationSchema = z.enum(LOCATIONS);
export const LocationWithAllSchema = z.enum(LOCATIONS_WITH_ALL);

export type Location = z.infer<typeof LocationSchema>;
export type LocationWithAll = z.infer<typeof LocationWithAllSchema>;
