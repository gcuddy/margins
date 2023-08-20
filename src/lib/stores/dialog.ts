import { writable } from 'svelte/store';

type Dialog = {
	open: boolean;
	title?: string;
    description?: string;
};

type AlertDialog<TData extends {}, TValue = string> = TData &
	Dialog & {
		action?: (value?: TValue) => void;
		value?: TValue;
	};

/**
 * A helper function to help re-use a single <Dialog /> component.
 */
export function createAlertDialogStore<TData extends {}>(defaultData?: AlertDialog<TData>) {
	const store = writable({ open: false, ...defaultData });

	return {
		...store,
		reset: () => {
			store.set({
				open: false
			} as AlertDialog<TData>);
		},
		open: (data: Omit<AlertDialog<TData>, 'open'>) => {
			store.set({
				...data,
				open: true
			});
		},
		close: () => {
			store.update((val) => ({
				...val,
				open: false
			}));
		},
		action: (reset = true) => {
			store.update((val) => {
				if (val.action) {
					val.action();
				}
				return {
					...(reset ? {} : val),
					open: false
				} as AlertDialog<TData>;
			});
		}
	};
}
