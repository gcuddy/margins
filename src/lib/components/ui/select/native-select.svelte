<script lang="ts">
	import { cn } from '$lib/utils';
	import { CaretSort } from 'radix-icons-svelte';
	import type { ComponentType } from 'svelte';

	type Option =
		| {
				value: any;
				label: string;
				icon?: ComponentType;
		  }
		| string;

	export let options: Option[] | { label?: string; options: Option[] }[] = [];

	let value: any | undefined = undefined;

	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<div class="relative w-max">
	<select class="absolute inset-0 w-full h-full opacity-0 appearance-none" bind:value>
		<slot>
			{#each options as option}
				{#if typeof option === 'object'}
					{#if 'options' in option}
						{@const options = option.options}
						<optgroup label={option.label}>
							{#each options as option}
								{#if typeof option === 'object'}
									<option value={option.value}>{option.label}</option>
								{:else}
									<option value={option}>{option}</option>
								{/if}
							{/each}
						</optgroup>
					{:else}
						<option value={option.value}>{option.label}</option>
					{/if}
				{:else}
					<option value={option}>{option}</option>
				{/if}
			{/each}
			<!--  -->
		</slot>
	</select>

	<div
		class={cn(
			'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
			className,
		)}
	>
		<slot name="label" {value}>
			{value}
		</slot>
		<CaretSort class="h-4 w-4 opacity-50" />
	</div>
</div>
