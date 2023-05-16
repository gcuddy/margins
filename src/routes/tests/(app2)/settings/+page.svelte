<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { H1 } from '$lib/components/ui/typography';
	import { LogOut, Palette, User } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	type Nav = {
		name: string;
		icon: ComponentType;
		href: string;
	};
	const nav: Nav[][] = [
		[
			{
				name: 'Profile',
				icon: User,
				href: '/tests/settings/profile'
			},
			{
				name: 'Appearance',
				icon: Palette,
				href: '/tests/settings/appearance'
			},
		],
		[
			{
				name: 'Log out',
				icon: LogOut,
				href: '/tests/settings/logout'
			}
		]
	];
</script>

<div class="space-y-4">
	{#each nav as section}
		<div class="flex flex-col overflow-hidden rounded-md border bg-secondary">
			{#each section as { name, icon, href }}
				<a
					{href}
					class="flex h-12 w-full items-center gap-x-4 p-4 text-lg font-medium tracking-tight hover:bg-border"
				>
					<svelte:component this={icon} class="h-6 w-6" />
					{name}</a
				>
			{/each}
		</div>
	{/each}
</div>
