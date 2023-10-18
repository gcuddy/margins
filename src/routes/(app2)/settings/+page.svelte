<script lang="ts">
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { LogOut, Palette, User, Workflow } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
    import { clear } from 'idb-keyval';

	export let data;

	type Nav = {
		href: string;
		icon: ComponentType;
		name: string;
	};
	const nav: Array<Array<Nav>> = [
		[
			{
				href: '/settings/profile',
				icon: User,
				name: data.user.username ?? 'Profile',
			},
			{
				href: '/settings/appearance',
				icon: Palette,
				name: 'Appearance',
			},
			{
				href: '/settings/integrations',
				icon: Workflow,
				name: 'Integrations',
			},
			// {
			// 	href: '/settings/vault',
			// 	icon: FolderSync,
			// 	name: 'External notes',
			// },
		],
	];

	const queryClient = useQueryClient();
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
	<form
		class="flex flex-col overflow-hidden rounded-md border bg-secondary"
		action="/s?/logout"
		method="post"
		use:enhance={async () => {
			// clear queryclient as well
			// TODO: couldn't a user just disable js and then the queryclient wouldn't be cleared?
			console.log('clearing queryclient');
			queryClient.clear();
            clear();
			console.log({ queryClient });
			return ({ update }) => {
				update();
			};
		}}
	>
		<button
			class="flex h-12 w-full items-center gap-x-4 p-4 text-lg font-medium tracking-tight hover:bg-border"
		>
			<LogOut class="h-6 w-6" />
			Log out
		</button>
	</form>
</div>
