<script lang="ts">
	import { page } from '$app/stores';

	import type { IconName } from '$lib/icons';
	import Icon from '../helpers/Icon.svelte';
	export let display: string;
	export let href: string;
	export let icon: IconName;
	export let active: (path: string) => boolean = (path) => path === href;

	$: isActive = active($page.url.pathname);
</script>

<a
	class="group flex h-7 items-center space-x-2 rounded px-2  font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 
  {isActive && 'bg-gray-200 dark:bg-gray-700'}
  "
	sveltekit:prefetch
	draggable="false"
	{href}
>
	<Icon
		wrapper={true}
		className="w-4 h-4 stroke-2 stroke-gray-500 group-hover:stroke-gray-800 dark:group-hover:stroke-gray-100 {isActive &&
			'stroke-gray-800 dark:stroke-gray-100'} relative"
		name={icon}
	/>
	<span class="truncate">{display}</span></a
>
