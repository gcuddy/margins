import type { IconName } from '$lib/icons';
import { z } from 'zod';

export const LOCATIONS = ['INBOX', 'SOON', 'LATER', 'ARCHIVE'] as const;

export const LOCATION_TO_DISPLAY = {
	INBOX: 'Inbox',
	SOON: 'Soon',
	LATER: 'Later',
	ARCHIVE: 'Archive'
} as const;

export const LOCATION_LIST = LOCATIONS.map((location) => ({
	name: LOCATION_TO_DISPLAY[location],
	id: location
}));

export const LOCATION_TO_ICON_SOLID: Record<Location, IconName> = {
	INBOX: 'inboxSolid',
	SOON: 'sparklesSolid',
	LATER: 'calendarSolid',
	ARCHIVE: 'archiveSolid'
};
export const LOCATION_TO_ICON_OUTLINE: Record<Location, IconName> = {
	INBOX: 'inbox',
	SOON: 'sparkles',
	LATER: 'calendar',
	ARCHIVE: 'archive'
};

export const LocationSchema = z.enum(LOCATIONS);

export type Location = z.infer<typeof LocationSchema>;
