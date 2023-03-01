
import type { Location } from "@prisma/client";

import { createContext } from "$lib/trpc/context";
import { appRouter } from "$lib/trpc/router";
import { groupBy } from "$lib/utils";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    const { locals, depends } = event;
    // const { user } = await locals.validateUser();
    // console.log(`(app)/layout.server.ts load function`);

    const theme = event.cookies.get("theme");
    // load settings
    event.depends("user:data");
    const caller = appRouter.createCaller(await createContext(event));
    try {
        const userData = await caller.user.data({
            bookmarks: false,
            subscriptions: true,
            stylesheets: true,
            states: true,
            color_descriptions: true,
        })
        // TODO: we should return a mutable store with this, but can't do that on the server (instead use layout.ts)
        // const userStore

        const locations = ["inbox", "soon", "later", "archive"];
        const sortedStates = userData.states?.sort(
            (a, b) => locations.indexOf(a.type) - locations.indexOf(b.type)
        );
        const locationLookup = groupBy(sortedStates || [], (state) => state.type);
        const stateIdToLocation: Map<number, Location> = new Map((sortedStates || []).map((state) => [state.id, state.type]))
        const stateIdToName: Map<number, string> = new Map((sortedStates || []).map((state) => [state.id, state.name]))
        return {
            user: {
                ...userData,
                states: sortedStates,
                locationLookup,
                stateIdToLocation,
                stateIdToName,
            },
            theme,
            authorized: true,
            // subscriptions,
            // bookmarks,
            // allEntries
        };
    } catch (error) {
        console.error(error);
        return {
            theme,
            authorized: false,
            user: null
        }
    }
    // return {
    // 	// theme
    // 	// user,
    //     authorized: false
    // };
};
