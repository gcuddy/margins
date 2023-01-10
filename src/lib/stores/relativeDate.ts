import dayjs from "$lib/dayjs";
import { readable } from "svelte/store";

export const createRelativeDateStore = (datetime: string) => {
    if (!datetime) return
    return readable(dayjs(datetime).fromNow(), (set) => {
        const interval = setInterval(() => {
            set(dayjs(datetime).fromNow());
        }, 1000 * 60);

        return function stop() {
            clearInterval(interval);
        };
    });
}