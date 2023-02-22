<script lang="ts">
	import { createEventDispatcher, onDestroy } from "svelte";
	import { onMount } from "svelte";
	const dispatch = createEventDispatcher();
	import type { EmojiPicker } from "picmo";

	let container: HTMLElement | undefined;
	let picker: EmojiPicker | undefined;
	onMount(async () => {
		// dynamic import from picmo
		const { createPicker } = await import("picmo");
		picker = createPicker({
			rootElement: container,
			emojisPerRow: 12,
			emojiSize: "17px",
			showCategoryTabs: false,
			showPreview: false,
			// theme: darkTheme,
			className: "emoji-picker",
		});
		picker.addEventListener("emoji:select", (e) => {
			dispatch("change", e);
		});
	});
	// onDestroy(() => {
	// 	!picker.isDestroyed && picker.destroy();
	// });
	// onMount(async () => {
	// 	const { createPopup } = await import('@picmo/popup-picker');
	// 	const trigger = document.querySelector('#emojiTrigger');

	// 	const picker = createPopup(
	// 		{},
	// 		{
	// 			referenceElement: trigger,
	// 			triggerElement: trigger,
	// 		}
	// 	);

	// 	trigger.addEventListener('click', () => {
	// 		picker.toggle();
	// 	});
	// 	picker.addEventListener('emoji:select', (selection) => {
	// 		dispatch('change', selection);
	// 	});
	// });
</script>

<div bind:this={container} />

<style lang="postcss">
	div :global(.emoji-picker) {
		--background-color: #1c1917;
		--category-name-background-color: #1c1917;
		border-radius: 0px;
		width: 100%;
	}
	div :global(.emoji-picker .categoryName) {
		@apply text-sm normal-case;

		& :global(.icon) {
			display: none;
		}
	}
</style>
