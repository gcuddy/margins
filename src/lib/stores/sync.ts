import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

interface SyncItem {
	uuid: string;
	title?: string;
	progress?: number;
}
function createSyncStore() {
	const { subscribe, set, update } = writable<SyncItem[]>([]);

	const addItem = (params?: Omit<Partial<SyncItem>, 'uuid'>) => {
		const uuid = uuidv4();
		update((items) => [...items, { uuid, title: params?.title, progress: params?.progress }]);
		return uuid;
	};
	const removeItem = (uuid: string) => {
		update((items) => items.filter((item) => item.uuid !== uuid));
	};

    // const await = async (promise: Promise<any>, params?: Omit<Partial<SyncItem>, 'uuid'>) => {
    //     const uuid = addItem(params);
    //     // add error handling
    //     return promise.then((result) => {
    //         removeItem(uuid);
    //         return result;
    //     }).catch((error) => {
    //         removeItem(uuid);
    //         throw error;
    //     });
    //     // promise.finally(() => removeItem(uuid));
    // }

	return {
		subscribe,
		addItem,
		removeItem,
		// convenience methods
		add: addItem,
		remove: removeItem,
        // await,
	};
}
export const syncStore = createSyncStore();
