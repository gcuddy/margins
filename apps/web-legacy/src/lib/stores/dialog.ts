import type { AlertDialogProps } from 'bits-ui/dist/bits/alert-dialog';
import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

type Dialog = {
	open: boolean;
	title?: string;
	description?: string;
	component?: ComponentType;
	props?: unknown;
};

type AlertDialog<TData extends {}, TValue = string> = TData &
	Dialog & {
		action?: (value?: TValue) => void;
		cancel?: () => void;
		value?: TValue;
		options?: Omit<AlertDialogProps, 'open'>;
	};

/**
 * A helper function to help re-use a single <Dialog /> component.
 */
export function createAlertDialogStore<TData extends {}>(
	defaultData?: AlertDialog<TData>,
) {
	const store = writable({ open: false, ...defaultData });

	return {
		...store,
		reset: () => {
			store.set({
				open: false,
			} as AlertDialog<TData>);
		},
		open: <TComponent extends SvelteComponent>(
			data: Omit<AlertDialog<TData>, 'open'> & {
				component?: ComponentType<TComponent>;
				props?: ComponentProps<TComponent>;
			},
		) => {
			store.set({
				...data,
				open: true,
			});
		},
		close: () => {
			store.update((val) => ({
				...val,
				open: false,
			}));
		},
		action: (reset = true) => {
			store.update((val) => {
				if (val.action) {
					val.action();
				}
				return {
					...(reset ? {} : val),
					open: false,
				} as AlertDialog<TData>;
			});
		},
	};
}

export const dialogStore = createAlertDialogStore();
