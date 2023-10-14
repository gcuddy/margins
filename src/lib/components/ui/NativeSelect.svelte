<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { ComponentType } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	export let value: any | undefined = undefined;
	let className = '';
	export { className as class };

	type Option = { value: any; label: string; icon?: ComponentType } | string;

	interface $$Props extends HTMLSelectAttributes {
		class?: string;
		options?: Option[];
		onChange?: (e: Event) => void;
	}
	export let options: Option[] = [];
	export let onChange: (e: Event) => void = () => {};
</script>

<!-- TODO: hide by absolute positioning another element here allowing icon etc -->
<select
	class={cn(
		'flex h-9 w-full appearance-none items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		className,
	)}
	on:change
	on:change={onChange}
	bind:value
	{...$$restProps}
>
	<slot>
		{#each options as option}
			{#if typeof option === 'object'}
				<option value={option.value}>{option.label}</option>
			{:else}
				<option value={option}>{option}</option>
			{/if}
		{/each}
	</slot>
</select>

<!-- background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); -->
<style lang="postcss">
	select {
        background-image: url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z' fill='%236b7280' fill-rule='evenodd' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 16px 16px;
		padding-right: 2.5rem;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
</style>
