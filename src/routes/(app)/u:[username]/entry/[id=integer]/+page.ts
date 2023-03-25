// import { parse, stringify } from "css";
import type { Config } from '@sveltejs/adapter-vercel';

import { getEntriesFromCache } from "$lib/features/entries/queries";
import { trpcWithQuery } from "$lib/trpc/client";

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

export const load = (async (event) => {
    const { data, parent } = event;
    const parentData = await parent();
    const { queryClient } = parentData;
    // const entries = getEntriesFromCache(queryClient);
    // const placeholderData = entries.find(e => e.id === data.id);
    const client = trpcWithQuery(event, queryClient);
    const utils = client.createContext();
    const params = {
        id: data.id
    } as const;
    console.time("entry");
    const [entry, entryData] = await Promise.all([
        utils.entries.public.byId.prefetch(params),
        utils.entries.loadUserData.prefetch(params)
    ])
    console.timeEnd("entry");
    return {
        ...data,
    };
}) satisfies PageLoad;
