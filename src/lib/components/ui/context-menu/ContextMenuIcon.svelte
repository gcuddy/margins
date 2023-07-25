<script lang="ts">
	import { getContext, type ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let icon: ComponentType;

    // Automatically set ContextMenuItem to inset
    const options: Writable<{inset: boolean}> = getContext('ContextMenuItem__options');
    $options.inset = true;
</script>

<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
	<svelte:component this={icon} class="w-4 h-4" />
</span>
