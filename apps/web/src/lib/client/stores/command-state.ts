import type { ComponentType } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import LibraryCommands from '../commands/library.commands.svelte';

type MenuState = {
	content: ComponentType;
	placeholder?: string;
	// ...
};

function bounce(container: HTMLElement) {
	const transform = getComputedStyle(container).transform;
	container.style.transform =
		transform === 'none' ? 'scale(0.96)' : `${transform} scale(0.96)`;
	setTimeout(() => {
		container.style.transform = transform;
	}, 75);
}

class Commander<TState> {
	private state = new Map<string, MenuState>();

	public add<TName extends string>(key: TName, menu: MenuState) {
		this.state.set(key as string, menu);
		return this as Commander<TState & { [key in TName]: MenuState }>;
	}

	public get<TName extends string>(key: TName) {
		return this.state.get(key as string) as MenuState;
	}
}

type ExtractMenu<T> = T extends Commander<infer U> ? U : never;
type CommandState = ExtractMenu<typeof commander>;
type CommandStateKey = keyof CommandState;

const commander = new Commander().add('library-items', {
	content: LibraryCommands,
	placeholder: 'Open item...',
});

type State = {
	currentMenu: string | null;
	input: string;
	open: boolean;
};

function main_command_state() {
	// TODO: is there a way to turn commander into effectively an enum/number comparison instead of the theoretically less efficient string comparison?
	const state = writable<State>({
		currentMenu: null,
		input: '',
		open: false,
	});

	const { set, subscribe, update } = state;

	const menuStack: string[] = [];

	const currentMenu = derived(state, ($state) => {
		if (!$state.currentMenu) return null;
		const menu = commander.get($state.currentMenu);
		if (!menu) return null;
		return menu;
	});

	const createPlaceholder = (placeholder: string) =>
		derived(
			[currentMenu],
			([$currentMenu]) => $currentMenu?.placeholder ?? placeholder,
		);

	const containerEl = writable<HTMLDivElement | null>(null);

	return {
		back: () => {
			menuStack.pop();
			update((state) => ({
				...state,
				currentMenu: menuStack.at(-1) ?? null,
			}));
		},
		close: () =>
			update((state) => ({ ...state, currentMenu: null, open: false })),
		containerEl,
		createPlaceholder,
		currentMenu,
		open: (menu: CommandStateKey | null = null) =>
			update((state) => ({ ...state, currentMenu: menu, open: true })),
		reset: () => {
			menuStack.length = 0;
			update((state) => ({
				...state,
				currentMenu: null,
				input: '',
			}));
		},
		run: (fn: () => void, keepOpen = false) => {
			if (keepOpen !== true) update((state) => ({ ...state, open: false }));
			fn();
		},
		set,
		setMenu: (
			menu: CommandStateKey,
			opts: {
				bounce?: boolean;
				resetInput?: boolean;
			} = {
				bounce: false,
				resetInput: true,
			},
		) => {
			menuStack.push(menu);
			if (opts.bounce === true) {
				const el = get(containerEl);
				console.log({ el });
				if (el) {
					bounce(el);
				}
			}
			update((state) => ({
				...state,
				currentMenu: menu,
				input: opts.resetInput === false ? state.input : '',
			}));
		},
		subscribe,
		toggle: () => update((state) => ({ ...state, open: !state.open })),
		update,
	};
}

export const mainCommandState = main_command_state();
