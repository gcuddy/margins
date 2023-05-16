import type { ComponentType, SvelteComponent } from "svelte";
import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
    const module = data.type === "movie" ? await import("./Movie.svelte") : data.type === "book" ? await import("./Book.svelte") : data.type === "podcast" ? await import("./Podcast.svelte") : data.type === "tv" ? await import("./TV.svelte") : data.type === "album" ? await import("./Album.svelte") : data.type === "article" ? await import("./Article.svelte") : data.type === "video" ? await import("./Video.svelte") : data.type === "tweet" ? await import("./Tweet.svelte") : data.type === 'pdf' ? await import("./PDF.svelte") : undefined;

    const component = module?.default as ComponentType | undefined;
    return {
        ...data,
        // component: module.default,
        component
    };
}) satisfies PageLoad