import { CheckCircle2Icon, CircleDashedIcon, CircleIcon } from 'lucide-svelte';

export const statusesWithIcons = {
	Backlog: CircleDashedIcon,
	Now: CircleIcon,
	Archive: CheckCircle2Icon
} as const;

export const statuses = Object.keys(statusesWithIcons) as (keyof typeof statusesWithIcons)[];

export type Status = keyof typeof statusesWithIcons;
