import type { IconName } from '$lib/icons';
import { z } from 'zod';

export const LOCATIONS = ['INBOX', 'SOON', 'LATER', 'ARCHIVE'] as const;
export const LOCATIONS_WITH_ALL = ['INBOX', 'SOON', 'LATER', 'ARCHIVE', 'ALL'] as const;

export const LOCATION_TO_DISPLAY = {
	INBOX: 'Inbox',
	SOON: 'Soon',
	LATER: 'Later',
	ARCHIVE: 'Archive',
	ALL: 'All',
} as const;

export const LOCATION_LIST = LOCATIONS.map((location) => ({
	name: LOCATION_TO_DISPLAY[location],
	id: location,
}));

export const LOCATION_TO_ICON_SOLID: Record<LocationWithAll, IconName> = {
	INBOX: 'inboxSolid',
	SOON: 'sparklesSolid',
	LATER: 'calendarSolid',
	ARCHIVE: 'archiveSolid',
	ALL: 'inboxStackMini',
};
export const LOCATION_TO_ICON_OUTLINE: Record<Location, IconName> = {
	INBOX: 'inbox',
	SOON: 'sparkles',
	LATER: 'calendar',
	ARCHIVE: 'archive',
};

export const LocationSchema = z.enum(LOCATIONS);
export const LocationWithAllSchema = z.enum(LOCATIONS_WITH_ALL);

export type Location = z.infer<typeof LocationSchema>;
export type LocationWithAll = z.infer<typeof LocationWithAllSchema>;
