import { createCachedValue } from "$lib/cache"
import { writable } from "svelte/store"

export const load = ({ data }) => {
    return {
        // TODO... cache here
        cache: createCachedValue("cache", () => writable(new Map())),
        ...data
    }
}