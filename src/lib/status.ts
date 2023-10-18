import {
	Archive,
	CheckCircle2Icon,
	CircleDashedIcon,
	CircleIcon,
	Star,
} from 'lucide-svelte';

export const statusesWithIcons = {
	Backlog: Archive,
	Now: Star,
	Archive: CheckCircle2Icon,
} as const;

export const statuses = Object.keys(
	statusesWithIcons,
) as (keyof typeof statusesWithIcons)[];

export type Status = keyof typeof statusesWithIcons;

export function isStatus(s: string): s is Status {
	return statuses.includes(s as Status);
}
