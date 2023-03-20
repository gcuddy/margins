import type { RouterOutputs } from "$lib/trpc/router";
import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

export const USER_DATA_KEY = 'user_data';

export function createUserDataStore() {
    return writable<{
        favorites: RouterOutputs["favorites"]["list"]
    }>({
        favorites: []
    })
}
type UserDataStore = ReturnType<typeof createUserDataStore>


export const getUserDataContext = () => {
    const current_list = getContext(USER_DATA_KEY);
    if (!current_list) {
        throw new Error(`User data context not found`)
    }
    return current_list as UserDataStore;
}

export const setUserDataContext = (user_data: UserDataStore) => setContext(USER_DATA_KEY, user_data)
