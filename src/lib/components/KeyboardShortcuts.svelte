<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { commands, jumpToArticle, jumpToTag } from '$lib/data/commands';
	import { commandStore } from '$lib/stores/commands';
	import { disableGlobalKeyboardShortcuts, lastKey } from '$lib/stores/keyboard';
	import { onMount } from 'svelte';
	import type { Command } from './CommandPalette/types';

	// export writable globalKeyboar (this should maybe be a svelte compnent)
	let timeout: number;

	function handleKeyCombos(e: KeyboardEvent) {
		const key = e.key;
		if ($lastKey === 'g') {
			switch (key) {
				case 'h': {
					goto('/');
					$lastKey = '';
					return true;
				}
				case 'r': {
					goto('/rss');
					$lastKey = '';
					return true;
				}
			}
		}
		if ($lastKey === 'o') {
			switch (key) {
				case 'a': {
					e.preventDefault();
					jumpToArticle();
					$lastKey = '';
					return true;
				}
				case 't': {
					e.preventDefault();
					jumpToTag();
					$lastKey = '';
					return true;
				}
			}
		}
		return false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if ($disableGlobalKeyboardShortcuts) {
			console.log('not handling keydown because $disableGlobalKeyboardShortcuts is true');
			return;
		}

		// first, for keystrokes, let's make sure we're not in an input field
		const activeElement = document.activeElement;
		if (activeElement instanceof HTMLInputElement) {
			return;
		}

		if ($lastKey === 'g' || $lastKey === 'o') {
			if (handleKeyCombos(e)) {
				$lastKey = e.key;
				return;
			}
		}

		$lastKey = e.key;

		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = window.setTimeout(() => {
			$lastKey = '';
		}, 750);

		// now just looking for single commands
		if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
			return;
		}

		// other commands
		const command = commands.find((c) => {
			// expand this to make it actually work for all shortcuts lol
			return c.kbd?.length === 1 && c.kbd?.[0]?.length === 1 && c.kbd?.[0]?.[0] === e.key;
		});
		console.log({ command });
		if (command) {
			e.preventDefault();
			console.log('command found, performing ');
			command.perform();
			return;
		}
	}

	// TODO: use useCommands(Commands) to handle this automagically
	let previousPage: string | undefined;
	afterNavigate((nav) => {
		previousPage = nav.from?.pathname;
	});
	$: console.log({ previousPage });
	/** Commands that rely on stores */

	const commandsThatRelyOnStores: Command[] = [
		{
			id: 'go-back',
			group: 'Navigation',
			check: () => previousPage !== undefined,
			name: 'Go back',
			perform: () => {
				if (previousPage) {
					goto(previousPage);
				}
			},
			icon: 'arrowRight',
			kbd: [['Escape']]
		}
	];
	onMount(() => {
		commandsThatRelyOnStores.forEach((command) => commandStore.add(command, false));
	});
</script>

<svelte:window on:keydown={handleKeydown} />
