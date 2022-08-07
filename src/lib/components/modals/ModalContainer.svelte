<script lang="ts">
	import { fade } from 'svelte/transition';
	export let isOpen: boolean;
	// export let classNameRoot = 'mx-auto max-w-2xl bg-white';
	let className = '';
	export { className as class };
	import { animationHappening, modals } from '$lib/stores/modals';
	import Dialog from '../helpers/dialog/Dialog.svelte';
	import DialogOverlay from '../helpers/dialog/DialogOverlay.svelte';
	import { fadeScale } from '$lib/transitions';
	import { custom_event } from 'svelte/internal';
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	$: if (!isOpen) {
		// modals.close();
	}
	let dialogRef: HTMLElement;

	$: isOpen ? disableGlobalKeyboardShortcuts.on() : disableGlobalKeyboardShortcuts.off();
</script>

<Dialog bind:open={isOpen} class="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]">
	<DialogOverlay
		class="fixed inset-0 bg-gray-500/25 dark:bg-gray-900/40"
		bind:el={dialogRef}
		transition={fade}
		transitionParams={{ duration: 150 }}
		on:outrostart={() => {
			$animationHappening = true;
		}}
		on:outroend={(e) => {
			console.log('outro done');
			$animationHappening = false;
		}}
	/>
	<div transition:fadeScale={{ duration: 150, baseScale: 0.95 }}>
		<!-- should these "root" classes be customizable? -->
		<div
			class="relative z-50 mx-auto max-w-2xl rounded-xl bg-gray-50 font-medium text-gray-900 shadow-2xl ring-1 ring-black/5 dark:bg-gray-700 dark:text-gray-100 {className}"
		>
			<slot />
		</div>
	</div>
</Dialog>
<!-- should this really be repated for each one? -->
