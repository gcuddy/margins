import { browser } from '$app/env';
import type { Command } from '$lib/components/CommandPalette/types';
import { lastKey } from '$lib/stores/keyboard';
import { commandStore } from '$lib/stores/commands';
import { modifiers, type Modifier } from '$lib/types/keyboard';
import type { ShortcutKey } from '$lib/types/keyboard';

const modifierEventKeys = ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'] as const;
const ModifierKey: Record<Modifier, typeof modifierEventKeys[number]> = {
	alt: 'altKey',
	ctrl: 'ctrlKey',
	shift: 'shiftKey',
	cmd: 'metaKey'
} as const;

function handleModifiers(e: KeyboardEvent, key: ShortcutKey[]) {
	const modifiersToLookFor = modifiers.filter((m) => key.includes(m as Modifier));
	const check = modifiersToLookFor.every((m) => {
		const modifierKey = ModifierKey[m];
		if (e[modifierKey]) {
			return true;
		}
		return false;
	});
	console.log({ check });
	if (check) {
		// now check if the key hit is correct
		const keyToLookFor = key.find((k) => !modifiers.includes(k as Modifier));
		console.log({ keyToLookFor, e });
		if (e.key.toLowerCase() === keyToLookFor?.toLowerCase()) {
			return true;
		}
	}
	return false;
}

// adds commands to command store, sets up their keyboard shortcuts and returns a function to remove them and reset the keyboard shortcuts
export function useCommands(commands: Command[], top = true) {
	let last = '';

	const unsubscribeLastKey = lastKey.subscribe((val) => {
		last = val;
	});

	commands.forEach((c) => {
		commandStore.add(c, top);
	});

	/** Map representing keys to listen for combos  */
	const shortcutMap = new Map<ShortcutKey[], Command>();

	commands.forEach((command) => {
		if (command.kbd) {
			command.kbd.forEach((keys) => {
				shortcutMap.set(keys, command);
			});
		}
	});

	function useKeyboardShortcuts(e: KeyboardEvent) {
		// listen for combos
		for (const [key, command] of shortcutMap.entries()) {
			if (key[0] === last && e.key === key[1]) {
				// only two keys can be done with leader key, should add a check for this
				e.preventDefault();
				e.stopPropagation();
				command.perform();
				return;
			}
			// handle modifiers
			if (handleModifiers(e, key)) {
				console.log('handleModifiers is true');
				e.preventDefault();
				e.stopPropagation();
				command.perform();
				return;
			}
			// finally, check if the single key hit is right
			if (key.length === 0 && e.key === key[0]) {
				e.preventDefault();
				e.stopPropagation();
				command.perform();
				return;
			}
		}
	}

	if (browser) {
		window.addEventListener('keydown', useKeyboardShortcuts);
	}
	return () => {
		commandStore.update(($commandStore) => {
			const idsToRemove = commands.map((a) => a.id);
			return $commandStore.filter((a) => !idsToRemove.includes(a.id));
		});
		unsubscribeLastKey();
		if (browser) {
			window.removeEventListener('keydown', useKeyboardShortcuts);
		}
	};
}
