<script lang="ts">
	import KeyboardNavItem from '../helpers/KeyboardNav/KeyboardNavItem.svelte';
	export let active = false;
</script>

<div
	class="block h-16 cursor-default group-focus:bg-gray-200 {active &&
		'bg-gray-200 dark:bg-gray-800/90'}"
>
	<div class="flex h-full  items-center space-x-4 border-b py-3 px-6 lg:px-9">
		<slot />
	</div>
</div>
