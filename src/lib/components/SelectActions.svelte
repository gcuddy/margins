<script lang="ts">
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { gentleFly } from '$lib/transitions';
	import { backIn, backOut } from 'svelte/easing';
	const clear = () => (selected_items = []);
	function handleKeydown(e: KeyboardEvent) {
		if ($disableGlobalKeyboardShortcuts) return;
		if (!selected_items?.length) return;
		if (e.key === 'Escape') {
			clear();
		}
	}
	// todo: expand this so it can take other things besides articles?
	type T = $$Generic;
	export let selected_items: (T & { id: number | string })[];
	// $: ids = selected_items.map(({ id }) => id);
</script>

<svelte:window on:keydown={handleKeydown} />

{#if selected_items.length}
	<div
		in:gentleFly|local={{
			duration: 400,
			easing: backOut,
		}}
		out:gentleFly|local={{
			duration: 400,
			easing: backIn,
		}}
		class="pointer-events-none fixed inset-x-0 bottom-9 z-30 flex justify-center"
	>
		<div
			class="dark:ring-black/15 pointer-events-auto flex h-11 flex-row items-center justify-center space-x-4 rounded-lg bg-gray-50 px-4 shadow-2xl ring ring-black/5 dark:bg-gray-800 dark:bg-gradient-to-br"
		>
			<span class="text-sm text-gray-500 dark:text-gray-300 lg:text-base">
				<span>{selected_items.length}</span> selected</span
			>
			<div class="flex space-x-4">
				<slot>
					<!-- <Button variant="ghost"> Move</Button> -->
					<!-- see ArticleSelectActions -->
				</slot>
			</div>
		</div>
	</div>
{/if}
