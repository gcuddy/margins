import { selected, showCommandPalette } from '$lib/stores/commands';

/**
 *
 * @param e - KeyboardEvent from the CommandPalette
 * @param max - The maximum number of items the index will increment
 * @param perform - The function to call when the command is selected
 */
export function handleKeydown(e: KeyboardEvent, max: number, perform: () => void) {
	console.log({ e });
	switch (e.key) {
		case 'ArrowDown': {
			e.preventDefault();
			console.log('down');
			selected.inc(max);
			break;
		}
		case 'ArrowUp': {
			e.preventDefault();
			console.log('dup');
			selected.dec();
			break;
		}
		case 'Enter': {
			e.preventDefault();
			console.log('enter');
			perform();
		}
	}
}

export function commandListener(e: KeyboardEvent) {
	if (e.metaKey && e.key === 'k') {
		e.preventDefault();
		console.log('cmd+k');
		showCommandPalette.toggle();
	}
	if (e.key === 'Escape') {
		showCommandPalette.out();
	}
}
