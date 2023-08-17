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
