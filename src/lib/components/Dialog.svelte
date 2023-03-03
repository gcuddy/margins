<script lang="ts">
	import { fadeScale } from "$lib/transitions";

	import { Dialog, DialogOverlay, DialogTitle } from "@rgossiaux/svelte-headlessui";
	import { fade } from "svelte/transition";
	// import DialogOverlay from './helpers/dialog/DialogOverlay.svelte';
	export let open = false;
	$: initialFocus =
		(container && (container.querySelector("[data-initial-focus]") as HTMLElement)) || undefined;
	let container: HTMLElement;
	let className = "";
	export { className as class };

	$: computedClass = !className.includes("max-w-") ? "max-w-2xl" : "";
</script>

<Dialog
	bind:open
	on:close={() => (open = false)}
	class="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]"
	{initialFocus}
>
	<div transition:fade={{ duration: 150 }}>
		<DialogOverlay class="fixed inset-0 bg-gray-50/50 dark:bg-gray-900/30" />
	</div>
	<div transition:fadeScale={{ duration: 150, baseScale: 0.95 }}>
		<!-- should these "root" classes be customizable? -->
		<div
			class="relative z-50 mx-auto rounded-xl bg-gray-50 font-medium text-gray-900 shadow-2xl ring-1 ring-black/5 transparency:bg-gray-50/50 transparency:backdrop-blur-xl transparency:backdrop-brightness-125 transparency:backdrop-saturate-200 dark:bg-gray-800 dark:text-gray-100 dark:transparency:bg-gray-800/50 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200 {computedClass} {className}"
			bind:this={container}
		>
			<DialogTitle class="col-span-1 col-start-2 place-self-center font-medium"
				><slot name="title" /></DialogTitle
			>
			<slot />
		</div>
	</div>
</Dialog>
