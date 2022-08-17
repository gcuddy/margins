import type { IconName } from '$lib/icons';
import { z } from 'zod';

export const LOCATIONS = ['INBOX', 'SOON', 'LATER', 'ARCHIVE'] as const;

export const LOCATION_TO_DISPLAY = {
	INBOX: 'Inbox',
	SOON: 'Soon',
	LATER: 'Later',
	ARCHIVE: 'Archive'
} as const;

export const LOCATION_TO_ICON_SOLID: Record<Location, IconName> = {
	INBOX: 'inboxSolid',
	SOON: 'clockSolid',
	LATER: 'calendarSolid',
	ARCHIVE: 'archiveSolid'
};
export const LOCATION_TO_ICON_OUTLINE: Record<Location, IconName> = {
	INBOX: 'inbox',
	SOON: 'clock',
	LATER: 'calendar',
	ARCHIVE: 'archive'
};

export const LocationSchema = z.enum(LOCATIONS);

export type Location = z.infer<typeof LocationSchema>;
