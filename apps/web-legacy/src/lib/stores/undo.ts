import { writable } from 'svelte/store';

type State<T> = {
    first: boolean;
    last: boolean;
    current: T;
    previous?: T;
    root: T;
}

export function createStack<T>(current: T) {
	const stack = [current];

	let index = stack.length;

	const state = writable<State<T>>({
		first: true,
		last: true,
		current,
		root: current,
		previous: undefined
	});

	function update() {
		current = stack[index - 1];

		state.set({
			first: index === 1,
			last: index === stack.length,
			current,
			previous: stack[index - 2],
			root: stack[0]
		});

		return current;
	}


	return {
		push: (value: T | ((current: T) => T)) => {
			stack.length = index;
			stack[index++] =
				typeof value === 'function' ? (value as ((current: T) => T))(current) : value;

			return update();
		},
		undo: () => {
			if (index > 1) index -= 1;
			return update();
		},
		redo: () => {
			if (index < stack.length) index += 1;
			return update();
		},
		subscribe: state.subscribe,
        // avoid these
        set: state.set,
        update: state.update
	};
}
