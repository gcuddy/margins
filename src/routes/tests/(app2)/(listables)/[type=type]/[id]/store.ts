import type { BeforeNavigate } from "@sveltejs/kit";
import { writable } from "svelte/store";

export const backContext = writable(`/tests/library/backlog`)


export function setBackContext(navigation: BeforeNavigate, path: string) {
    if (navigation?.to?.route?.id?.endsWith(`[type=type]/[id]`)) {
        backContext.set(path)
    }
}

export function createArticleStore() {

    return {
        states: {
            progress: writable(0)
        }
    }
}
