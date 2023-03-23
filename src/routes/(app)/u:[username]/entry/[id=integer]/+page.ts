import { parse, stringify } from "css";
import type { Config } from '@sveltejs/adapter-vercel';

import { getEntriesFromCache } from "$lib/features/entries/queries";
import { trpcWithQuery } from "$lib/trpc/client";

import type { PageLoad } from "./$types";

export const config: Config = {
    runtime: "nodejs16.x"
}

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
    // console.time("stylesheet");
    // const stylesheet = parentData.user?.stylesheets?.find((s) => article?.uri?.includes(s.domain));
    // console.log({ stylesheet });

    // if (stylesheet) {
    //     // SCOPE STYLESHEET
    //     return {
    //         ...data,
    //         // article,
    //         // query,
    //         css: scopeCss(stylesheet.css),
    //     };
    // }
    // console.timeEnd("stylesheet");
    return {
        ...data,
        entry: utils.entries.public.byId.getData(params) ?? utils.entries.public.byId.fetch(params),
        data: utils.entries.loadUserData.getData(params) ?? utils.entries.loadUserData.fetch(params),
    };
}) satisfies PageLoad;
