import type { FilterLibrarySchema } from "$lib/schemas/library";
import { writable } from "svelte/store";

function createFilterStore() {

    const filter: FilterLibrarySchema = {};

    const store = writable<FilterLibrarySchema>({});

    let searchStr = '';

    return {
        add: (filter: Partial<FilterLibrarySchema>) => {
            store.update((val) => {
                return { ...val, ...filter };
            });
        }
    }
}

type FilterDialogStoreProps = {
    title?: string;
    open: boolean;
    type?: 'text';
    action?: (value: string) => void;
    value?: string;
}

export function createFilterDialogStore() {
    const filterDialogStore = writable<FilterDialogStoreProps>({
		open: false
	});

    return {
        ...filterDialogStore,
        reset: () => {
            filterDialogStore.set({
                open: false
            });
        },
        open: (props: Omit<FilterDialogStoreProps, "open">) => {
            filterDialogStore.set({
                open: true,
                ...props
            });
        },
        action: (reset = true) => {
            filterDialogStore.update((val) => {
                console.log('action', {val})
                if (val.action) {
                    val.action(val.value ?? '');
                }
                return {
                    ...(reset ? {} : val),
                    open: false
                }
            })
        }

    }
}
