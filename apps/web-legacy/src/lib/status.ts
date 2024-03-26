import {
	Archive,
	CheckCircle2Icon,
	CircleDashedIcon,
	CircleIcon,
	Hourglass,
	Sparkles,
	Star,
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const statusesWithIcons = {
	Backlog: Hourglass,
	Now: Sparkles,
	Archive: CheckCircle2Icon,
} as const;

export const statusesToDisplay = {
	Backlog: 'Later',
	Now: 'Now',
	Archive: 'Finished',
} as const;

export const displayToStatus = {
	Finished: 'Archive',
	Now: 'Now',
	Later: 'Backlog',
} as const;

export function isDisplayStatus(status: string): status is DisplayStatus {
	return status in displayToStatus;
}

export function getStatusIcon(status: string, display = false) {
	if (display) {
		if (isDisplayStatus(status)) {
			return statusesWithIcons[displayToStatus[status]] as ComponentType;
		}
	}
	if (isStatus(status)) {
		return statusesWithIcons[status] as ComponentType;
	}
	return null;
}

export const statuses = Object.keys(
	statusesWithIcons,
) as Array<keyof typeof statusesWithIcons>;

export const displayStatuses = Object.values(statusesToDisplay);

export type DisplayStatus = (typeof displayStatuses)[number];

export type Status = keyof typeof statusesWithIcons;

export function isStatus(s: unknown): s is Status {
	if (typeof s !== 'string') {return false;}
	return statuses.includes(s as Status);
}
