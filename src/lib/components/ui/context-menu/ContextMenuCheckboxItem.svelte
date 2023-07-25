<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import { writable } from 'svelte/store';
	import type { C } from './utils';
	import { CheckIcon } from 'lucide-svelte';
	import Checkbox from '../checkbox/Checkbox.svelte';

	export let checkboxItem: C['checkboxItem'];
	export let checked: boolean;

	const checked_store = writable(checked);

	$: checked_store.set(checked);

	let className = '';
	export { className as class };

	export let onSelect = (e: Event) => {};

	export let useCheckbox = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	{...$checkboxItem}
	use:checkboxItem={{ checked: checked_store, onSelect }}
>
	<!-- slot -->
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		{#if useCheckbox}
			<Checkbox on:click={(e) => {
                // Stop propagation so that the context menu doesn't close
                e.stopPropagation();
                onSelect(e);
                console.log('click', e)
            }} bind:checked={$checked_store} />
		{:else if $checked_store}
			<CheckIcon class="h-4 w-4" />
		{/if}
	</span>
	<slot />
</div>
