<script lang="ts">
	type T = $$Generic;
	export let value: T | undefined = undefined;
	export let name: string | undefined = undefined;
	export let id: string | undefined = undefined;
	export let block = true;
	let className = '';
	export { className as class };
</script>

<!-- p-2.5 -->
<select
	{name}
	{id}
	class="{block
		? 'block w-full'
		: 'inline'} rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 {className}"
	bind:value
	on:change
>
	<slot />
</select>
