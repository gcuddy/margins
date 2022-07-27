<script lang="ts">
	export let rows = 4;
	export let id = 'note';
	export let name = id;
	export let label = '';
	export let placeholder = 'Add a note...';
	export let value = '';
	export let className = '';
	export let autofocus = false;
</script>

<div class={className}>
	{#if label}
		<label for={id} class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400"
			>{label}</label
		>
	{/if}
	<textarea
		{id}
		{rows}
		{name}
		{autofocus}
		class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
		{placeholder}
		{value}
	/>
</div>
