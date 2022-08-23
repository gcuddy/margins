<script lang="ts">
	import KeyboardNavItem from '../helpers/KeyboardNav/KeyboardNavItem.svelte';
	export let index: number;
	export let item: {
		id: string | number;
	};
	export let href: string;

	let active_item_id: string | number | undefined = undefined;
</script>

<KeyboardNavItem
	let:active
	let:followTabIndex
	{index}
	as="a"
	on:mouseover={() => (active_item_id = item.id)}
	on:focus={() => (active_item_id = item.id)}
	on:mouseleave={() => (active_item_id = undefined)}
	on:blur={() => (active_item_id = undefined)}
	{href}
	class={({ active }) =>
		`block h-16 cursor-default group-focus:bg-gray-200 ${
			active_item_id === item.id ? 'bg-gray-100 dark:bg-gray-800' : ''
		} ${active && 'bg-gray-200 dark:bg-gray-800/90'}`}
>
	<div class="flex h-full  items-center space-x-4 border-b py-3 px-6 lg:px-9">
		<slot />
	</div>
</KeyboardNavItem>
