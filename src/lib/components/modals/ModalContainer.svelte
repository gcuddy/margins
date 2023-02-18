<script lang="ts">
	import { fade } from "svelte/transition";
	let className = "";
	export { className as class };
	import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui";
	// import Dialog from '../helpers/dialog/Dialog.svelte';
	// import DialogOverlay from '../helpers/dialog/DialogOverlay.svelte';
	import { fadeScale } from "$lib/transitions";
	import { disableGlobalKeyboardShortcuts } from "$lib/stores/keyboard";
	import { modals, type ModalComponent } from "$lib/stores/modals";
	import { onDestroy } from "svelte";
	import { backIn, backOut } from "svelte/easing";
	let dialogRef: HTMLElement;
	$: modal.open ? disableGlobalKeyboardShortcuts.on() : disableGlobalKeyboardShortcuts.off();
	let container: HTMLElement;
	$: initialFocus =
		(container && (container.querySelector("[data-initial-focus]") as HTMLElement)) || undefined;
	$: console.log({ initialFocus });
	export let modal: ModalComponent;
	onDestroy(() => {
		disableGlobalKeyboardShortcuts.off();
	});
</script>

<Dialog
	bind:open={modal.open}
	on:close={() => {
		modal.open = false;
		modals.close({
			id: modal.id,
		});
		// modal.open = false;
	}}
	class="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]"
	{initialFocus}
>
	<div transition:fade={{ duration: 150 }}>
		<DialogOverlay class="fixed inset-0 bg-gray-50/50 dark:bg-gray-900/30" />
	</div>
	<div transition:fadeScale={{ duration: 150, baseScale: 0.95 }}>
		<!-- out:fadeScale={{
			duration: 150,
			baseScale: 0.95,
			easing: backIn,
		}} -->
		<!-- should these "root" classes be customizable? -->
		<div
			class="relative z-50 mx-auto max-w-2xl rounded-xl bg-gray-50 font-medium text-gray-900 shadow-2xl ring-1 ring-black/5 transparency:bg-gray-50/50 transparency:backdrop-blur-xl transparency:backdrop-brightness-125 transparency:backdrop-saturate-200 dark:bg-gray-800 dark:text-gray-100 dark:transparency:bg-gray-800/50 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200 {className}"
			bind:this={container}
		>
			<slot />
		</div>
	</div>
</Dialog>
<!-- should this really be repated for each one? -->
