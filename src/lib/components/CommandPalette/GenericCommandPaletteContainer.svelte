<script lang="ts">
	import { fade } from 'svelte/transition';
	import Dialog from '../helpers/dialog/Dialog.svelte';
	import { writable } from 'svelte/store';
	import type { ComponentProperties } from '$lib/stores/types';
	import GenericCommandPalette from './GenericCommandPalette.svelte';
	import DialogOverlay from '../helpers/dialog/DialogOverlay.svelte';
	import { animationHappening } from '$lib/stores/modals';
	import { custom_event, tick } from 'svelte/internal';
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { commandPaletteStore } from './store';
	// is there a better way? need it for dialogoverlay outroend
	let term = writable('');

	let dialogRef: HTMLElement;

	$: $commandPaletteStore.isOpen,
		$commandPaletteStore.isOpen
			? disableGlobalKeyboardShortcuts.on()
			: tick().then(() => disableGlobalKeyboardShortcuts.off());
</script>

<!-- <svelte:window on:keydown={commandListener} /> -->

<Dialog
	bind:open={$commandPaletteStore.isOpen}
	class="fixed inset-0 z-50 overflow-y-auto p-4 pt-[15vh]"
>
	<DialogOverlay
		bind:el={dialogRef}
		class="fixed inset-0 bg-gray-500/10 dark:bg-black/25"
		transition={fade}
		transitionParams={{ duration: 150 }}
		on:outrostart={() => {
			$animationHappening = true;
		}}
		on:outroend={(e) => {
			$term = '';
			$animationHappening = false;
		}}
	/>
	<!-- key block to re-play transition on change? -->
	{#key $commandPaletteStore.props}
		<GenericCommandPalette
			values={$commandPaletteStore.props.values || []}
			{...$commandPaletteStore.props}
			bind:term
			bind:open={$commandPaletteStore.isOpen}
		/>
	{/key}
</Dialog>
