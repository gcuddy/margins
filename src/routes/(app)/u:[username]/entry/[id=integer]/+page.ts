// import { parse, stringify } from "css";
import type { Config } from '@sveltejs/adapter-vercel';

import { getEntriesFromCache } from "$lib/features/entries/queries";
import { trpc, trpcWithQuery } from "$lib/trpc/client";

import type { PageLoad } from "./$types";


function scopeCss(css: string) {
    console.time("scopeCss");
    const ast = parse(css);
    if (!ast.stylesheet) return;
    ast.stylesheet.rules = ast.stylesheet.rules.map((rule) => {
        if (rule.type === "rule" && "selectors" in rule) {
            rule.selectors = rule.selectors?.map((selector) => {
                return `#entry-container ${selector}`;
            });
        }
        return rule;
    });

    const str = stringify(ast);
    console.timeEnd("scopeCss");
    return str;
}

// const publicQuery = createquery for public entries, with no user data, skipping batch link

export const load = (async (event) => {
    console.log("helloooooooo")
    const { parent, params } = event;
    const parentData = await parent();
    const { queryClient } = parentData;
    // const entries = getEntriesFromCache(queryClient);
    // const placeholderData = entries.find(e => e.id === data.id);
    const client = trpcWithQuery(event, queryClient);
    const utils = client.createContext();
    const opts = {
        id: +params.id
    } as const;
    const [entry] = await Promise.all([
        utils.entries.public.byId.prefetch(opts),
        // utils.entries.getAnnotations.prefetch(opts),
        // utils.entries.getRelations.prefetch(opts),
        // utils.entries.getCollections.prefetch(opts),
        // utils.entries.loadUserData.prefetch(opts)
    ])
    console.log({ entry })
    return {
        // ...data,
        id: +params.id,
    };
}) satisfies PageLoad;
