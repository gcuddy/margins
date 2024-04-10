import type { ComponentType } from 'svelte';
import ArrowRight from 'lucide-svelte/icons/arrow-right';
import type { Command } from '@margins/features/commands';
import { mainCommandState } from './stores/command-state';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { page } from '$app/stores';

export function NavigationCommand(input: {
	category: string;
	disabled?: boolean;
	icon?: ComponentType;
	path: string;
	title: string;
}): Command {
	const $page = get(page);
	return {
		action: () => {
			mainCommandState.close();
			goto(input.path);
		},
		category: input.category,
		// TODO: more robust way to detect if command is disabled
		disabled: input.disabled || $page.url.pathname === input.path,
		icon: input.icon ?? ArrowRight,
		label: input.title,
	};
}
