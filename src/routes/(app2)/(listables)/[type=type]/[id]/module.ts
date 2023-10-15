import type { Type } from "$lib/types";
import type { ComponentType } from "svelte";


export function get_module(type: Type): Promise<{ default: ComponentType } | undefined> {
    switch (type) {
        case "movie":
            return import("./Movie.svelte");
        case "book":
            return import("./Book.svelte");
        case "podcast":
            return import("./Podcast.svelte");
        case "tv":
            return import("./TV.svelte");
        case "album":
            return import("./Album.svelte");
        case "article":
            return import("./Article.svelte");
        case "video":
            return import("./Video.svelte");
        case "tweet":
            return import("./Tweet.svelte");
        case "pdf":
            return import("./PDFViewer.svelte");
        default:
            return undefined;
    }
}
