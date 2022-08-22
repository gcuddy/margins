<script lang="ts">
	export let text: string;
	export let kbd: string | undefined = undefined;
</script>

<div
	class="flex min-w-fit items-baseline justify-between space-x-3 rounded-md border border-gray-600 bg-gray-50 px-3 py-1 text-xs shadow-xl dark:border-gray-500 dark:bg-gray-800"
	role="tooltip"
>
	<span>{text}</span>
	{#if kbd}
		<!-- todo: use kbd group -->
		<kbd class=" font-medium text-gray-600 dark:text-gray-400">{kbd}</kbd>
	{/if}
</div>
