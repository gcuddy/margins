import { derived, get,writable } from "svelte/store";

import type { Command } from "$lib/components/CommandPalette/types";
import { commands } from "$lib/data/commands";
export const term = writable("");

function createCommandStore() {
	const { subscribe, set, update } = writable(commands);

	function add(command: Command, top = true) {
		update((commands) => {
			// only add if id is not already in the list
			if (!commands?.find((c) => c.id === command.id)) {
				if (top) {
					return [command, ...commands];
				} else {
					return [...commands, command];
				}
			}
			return commands;
		});
	}

	return {
		subscribe,
		set,
		add,
		update,
	};
}

export const commandStore = createCommandStore();
//todo: use useCommand to handle setup easily
// const fuse = new Fuse(commands, {)
export const filteredActions = derived([term, commandStore], ([$term, $items]) => {
	// TODO: sort by group
	$items = $items?.filter((i) => !("check" in i) || i.check?.());
	return $items?.filter((x) => (x?.name + x?.keywords).toLowerCase().includes($term.toLowerCase()));
});

function createSelectedStore() {
	const { subscribe, set, update } = writable(0);
	return {
		subscribe,
		set,
		inc: (max = 9) => update((n) => Math.min(n + 1, max)),
		dec: () => update((n) => Math.max(n - 1, 0)),
		reset: () => set(0),
	};
}

export const selected = createSelectedStore();

function createShowCommandPaletteStore() {
	const { subscribe, set, update } = writable(false);
	const cleanup = () => {
		selected.reset();
		term.set("");
	};
	return {
		subscribe,
		set,
        isOpen: () => get(showCommandPalette),
		toggle: () =>
			update((t) => {
				if (t) {
					cleanup();
					return false;
				} else {
					return true;
				}
			}),
		out: () => {
			set(false);
			cleanup();
		},
		show: () => {
			set(true);
		},
	};
}

export const showCommandPalette = createShowCommandPaletteStore();

export const selectedCommand = derived(
	[selected, filteredActions],
	([$selected, $filteredActions]) => $filteredActions?.[$selected]
);

// // includes command palettes as well
// export const dialogPresent: Readable<boolean> = derived(
// 	[showCommandPalette, modals],
// 	([$showCommandPalette, $modals]) => {
// 		return $showCommandPalette || $modals.length > 0;
// 	}
// );
