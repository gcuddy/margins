import { create_state } from "$lib/state"
import { get } from "svelte/store"

export const load = async (e) => {
    const state = create_state(e, "entries_by_tag", {
        name: "favorites"
    })
    console.log({ state: get(state) })
    return {
        state,
    }
}