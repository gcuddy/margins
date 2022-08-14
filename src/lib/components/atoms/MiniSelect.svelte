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
	class="m-0 h-6 min-w-min appearance-none justify-start rounded border-0 bg-gray-200 py-0 pl-2 pr-12 text-xs font-medium dark:bg-gray-700 dark:text-white"
	bind:value
	on:change
>
	<slot />
</select>
