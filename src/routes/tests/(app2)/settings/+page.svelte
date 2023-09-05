<script lang="ts">
	import { FolderSync, LogOut, Palette, User } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { H1 } from '$lib/components/ui/typography';

	type Nav = {
		href: string;
		icon: ComponentType;
		name: string;
	};
	const nav: Array<Array<Nav>> = [
		[
			{
				href: '/tests/settings/profile',
				icon: User,
				name: 'Profile'
			},
			{
				href: '/tests/settings/appearance',
				icon: Palette,
				name: 'Appearance'
			},
			{
				href: '/tests/settings/vault',
				icon: FolderSync,
				name: 'External notes'
			},
		],
		[
			{
				href: '/tests/settings/logout',
				icon: LogOut,
				name: 'Log out'
			}
		]
	];
</script>

<div class="space-y-4">
	{#each nav as section}
		<div class="flex flex-col overflow-hidden rounded-md border bg-secondary">
			{#each section as { href, icon, name }}
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
