import { nanoid } from "nanoid/non-secure";
import { writable } from "svelte/store";

function dialog_store() {
    const { subscribe, set, update } = writable<string[]>([]);

    return {
        subscribe,
        add: (id?: string) => {
            const idToUse = id ?? nanoid();
            update((ids) => {
                if (ids.includes(idToUse)) {
                    return ids;
                }
                return [...ids, idToUse];
            });
            return idToUse;
        },
        remove: (id: string) => update((ids) => ids.filter((i) => i !== id)),
    }
}

export const dialogs = dialog_store();
