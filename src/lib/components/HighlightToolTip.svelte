<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Swatches from './ColorPicker/Swatches.svelte';
	import Icon from './helpers/Icon.svelte';
	const dispatch = createEventDispatcher();
	export let labels = true;
</script>

<div>
	<div class="grid grid-cols-4 gap-2 border-gray-100 p-1 dark:border-gray-50 dark:text-white">
		<!-- currently using pointerdown so we can beat the selection being cleared -->
		<button
			class="col-span-2 flex shrink-0 flex-col items-center rounded-md  p-1 transition hover:bg-primary-600/10 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={(e) => {
				dispatch('highlight');
			}}
			><Icon name="pencil" />
			{#if labels}<span class="text-xs">highlight</span>{/if}</button
		>
		<button
			class="col-span-2 flex shrink-0 flex-col items-center rounded-md p-1 transition hover:bg-primary-600/10 dark:hover:bg-white/20"
			on:pointerdown|preventDefault|stopPropagation={() => dispatch('annotate')}
			><Icon name="annotation" />
			{#if labels}<span class="text-xs">annotate</span>{/if}</button
		>
	</div>
	<!-- <div>
		<Swatches class="" />
	</div> -->
</div>
