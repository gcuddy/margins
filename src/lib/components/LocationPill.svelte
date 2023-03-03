<script lang="ts">
	import type { Location } from '$lib/types/schemas/Locations';
	import Icon from './helpers/Icon.svelte';
	import RightClickMenu from './RightClickMenu.svelte';
	export let location: Location;

	export let context_menu_open = false;
	$: console.log({ context_menu_open });
	let x = 0;
	let y = 0;
</script>

<!-- Taken from Tag.svelte; should componentize this -->

<a
	class="leading-sm inline-flex h-6 w-max min-w-fit max-w-fit items-center justify-center gap-1 overflow-hidden rounded-lg border border-gray-200  pr-2 pl-1.5 text-xs
  font-medium text-gray-600 transition hover:border-gray-300 hover:bg-primary-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-700 {context_menu_open &&
		'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-700'}"
	href="/{location.toLowerCase()}"
	tabIndex="-1"
	on:click
	on:contextmenu|preventDefault={({ clientX, clientY }) => {
		context_menu_open = true;
		x = clientX;
		y = clientY;
	}}
>
	{#if location.toUpperCase() === 'INBOX'}
		<Icon name="inboxSolid" className="h-3 w-3 fill-gray-500" />
		<span>Inbox</span>
	{:else if location.toUpperCase() === 'SOON'}
		<Icon name="sparklesSolid" className="h-3 w-3 fill-primary-600" />
		<span>Soon</span>
	{:else if location.toUpperCase() === 'LATER'}
		<Icon name="calendarSolid" className="h-3 w-3 fill-gray-700" />
		<span>Later</span>
	{:else if location.toUpperCase() === 'ARCHIVE'}
		<Icon name="archiveSolid" className="h-3 w-3 fill-gray-500" />
		<span>Archive</span>
	{/if}
</a>

<RightClickMenu
	bind:open={context_menu_open}
	{x}
	{y}
	items={[
		[
			{
				label: 'Inbox',
				icon: 'inboxSolid',
			},
			{
				label: 'Soon',
				icon: 'sparklesSolid',
			},
			{
				label: 'Later',
				icon: 'calendarSolid',
			},
			{
				label: 'Archive',
				icon: 'archiveSolid',
			},
		],
	]}
/>
