<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from './helpers/Icon.svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="border-gray-100 p-1 shadow-lg dark:border-gray-50 dark:text-white flex gap-2">
	<button
		class="rounded-md p-1 transition hover:bg-black/5  dark:hover:bg-white/20"
		on:click={() => dispatch('highlight')}><Icon name="pencil" /></button
	>
	<button
		class="rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/20"
		on:click={() => dispatch('annotate')}><Icon name="annotationSolid" /></button
	>
</div>
