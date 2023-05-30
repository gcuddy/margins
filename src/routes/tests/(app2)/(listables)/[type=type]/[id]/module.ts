import type { PageLoad } from "./$types";


export function get_module(type: Parameters<PageLoad>[0]["data"]["type"]) {
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
            return import("./PDF.svelte");
        default:
            return undefined;
    }
}
