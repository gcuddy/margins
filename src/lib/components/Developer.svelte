<script lang="ts">
	import { browser } from '$app/env';

	import { useCommands } from '$lib/hooks/use-commands';

	import { dev } from '$lib/stores/developer';

	let keyPressed = '';
	function handleKeydown(e: KeyboardEvent) {
		keyPressed = e.key;
		if (e.metaKey) {
			// use unicode for meta key
			keyPressed = '\u2318+' + keyPressed;
		}
		if (e.ctrlKey) {
			keyPressed = '\u2303+' + keyPressed;
		}
		if (e.shiftKey) {
			keyPressed = '\u21E7+' + keyPressed;
		}
		if (e.altKey) {
			keyPressed = '\u2325+' + keyPressed;
		}
	}

	useCommands(
		[
			{
				id: 'dev-toggle-keypress',
				name: 'Developer: Toggle Kepress',
				icon: 'cog',
				perform: () => ($dev.keypress = !$dev.keypress)
			},
			{
				id: 'dev-toggle-list-imgs',
				name: 'Developer: Toggle Disable List Imgs',
				icon: 'cog',
				perform: () => ($dev.disableListImgs = !$dev.disableListImgs)
			}
		],
		false
	);
	let activeElement: Element | null;
	$: if (browser && $dev.activeElement) {
		activeElement = document.activeElement;
	}
</script>

<svelte:window on:keydown={handleKeydown} />
{#if $dev.keypress}
	<div
		class="fixed left-0 bottom-0 z-50 flex h-24 w-48 items-center justify-center bg-gray-300 font-mono text-lg font-medium ring"
	>
		<span>{keyPressed}</span>
	</div>
{/if}

{#if $dev.activeElement}
	<div
		class="fixed left-0 bottom-0 z-50 flex h-24 w-48 items-center justify-center bg-gray-300 font-mono text-lg font-medium ring"
	>
		{activeElement}
	</div>
{/if}
