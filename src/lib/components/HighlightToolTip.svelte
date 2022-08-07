<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from './helpers/Icon.svelte';
	const dispatch = createEventDispatcher();
	export let labels = true;
	export let edit = false;
</script>

<div class="flex gap-2 border-gray-100 p-1 shadow-lg dark:border-gray-50 dark:text-white">
	<!-- currently using pointerdown so we can beat the selection being cleared -->
	{#if edit}
		<button
			class="flex flex-col items-center rounded-md  p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={(e) => {
				dispatch('highlight');
			}}
			><Icon name="pencilAlt" />
			{#if labels}<span class="text-xs">edit</span>{/if}</button
		>
		<button
			class="flex flex-col items-center rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
			on:click={() => dispatch('annotate')}
			><Icon name="trash" />
			{#if labels}<span class="text-xs">delete</span>{/if}</button
		>
	{:else}
		<button
			class="flex flex-col items-center rounded-md  p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={(e) => {
				dispatch('highlight');
			}}
			><Icon name="pencil" />
			{#if labels}<span class="text-xs">highlight</span>{/if}</button
		>
		<button
			class="flex flex-col items-center rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
			on:click={() => dispatch('annotate')}
			><Icon name="annotation" />
			{#if labels}<span class="text-xs">annotate</span>{/if}</button
		>
	{/if}
</div>
