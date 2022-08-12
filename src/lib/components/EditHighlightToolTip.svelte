<script lang="ts">
	import type { Annotation } from '@prisma/client';

	import { createEventDispatcher } from 'svelte';
	import Icon from './helpers/Icon.svelte';
	const dispatch = createEventDispatcher();
	export let labels = true;
	export let annotation: Annotation | undefined;
	$: console.log({ annotation });
</script>

<div
	class="grid grid-cols-4 gap-1 border-gray-100 p-1 shadow-lg dark:border-gray-50 dark:text-white"
>
	<!-- currently using pointerdown so we can beat the selection being cleared -->
	{#if annotation?.body}
		<button
			class="col-span-2 flex shrink-0 flex-col items-center rounded-md  p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={(e) => {
				dispatch('edit', {
					annotation
				});
			}}
			><Icon name="pencilAlt" />
			{#if labels}<span class="text-xs">edit</span>{/if}</button
		>
	{:else}
		<button
			class="col-span-2 flex shrink-0 flex-col items-center rounded-md  p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={(e) => {
				dispatch('annotate');
			}}
			><Icon name="pencilAlt" />
			{#if labels}<span class="text-xs">annotate</span>{/if}</button
		>
	{/if}
	<button
		class="col-span-2 flex shrink-0 flex-col items-center rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
		on:click={() => dispatch('delete')}
		><Icon name="trash" />
		{#if labels}<span class="text-xs">delete</span>{/if}</button
	>
</div>
