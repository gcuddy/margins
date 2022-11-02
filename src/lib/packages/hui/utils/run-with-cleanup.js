import { onDestroy } from "svelte";
export function createRunWithCleanup() {
    let cleanup = {};
    onDestroy(() => {
        for (const id in cleanup) {
            cleanup[id]();
            delete cleanup[id];
        }
    });
    return (fn, id) => {
        if (cleanup[id]) {
            cleanup[id]();
            delete cleanup[id];
        }
        const result = fn();
        if (typeof result === "function") {
            cleanup[id] = result;
        }
    };
}
