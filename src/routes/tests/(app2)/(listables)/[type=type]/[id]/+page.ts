import type { ComponentType, SvelteComponent } from "svelte";
import type { PageLoad } from "./$types";
import { get_module } from "./module";

export const load = (async ({ data }) => {
    const module = await get_module(data.type);
    const component = module?.default as ComponentType | undefined;
    return {
        ...data,
        // component: module.default,
        component
    };
}) satisfies PageLoad