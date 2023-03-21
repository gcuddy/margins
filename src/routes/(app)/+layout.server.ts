
import type { Location } from "@prisma/client";
import { redirect } from "@sveltejs/kit";
import { TRPCError } from "@trpc/server";

import { createContext } from "$lib/trpc/context";
import { appRouter } from "$lib/trpc/router";
import { groupBy } from "$lib/utils";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    const { locals, depends } = event;
    const session = await locals.validate();
    console.log(`(app)/layout.server.ts load function`);

    const theme = event.cookies.get("theme");
    // load settings
    event.depends("user:data");

    try {
        if (!session) {
            throw new Error("unauthorized")
        }
        const caller = appRouter.createCaller(await createContext(event));
        const userData = await caller.user.data({
            // bookmarks: false,
            // subscriptions: true,
            // stylesheets: true,
            states: true,
            // color_descriptions: true,
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
        if (error instanceof TRPCError) {
            console.log("TRPC ERROR")
            if (error.code === "UNAUTHORIZED") {
                // TODO: unauthorized site
                throw redirect(307, "/login")
            }
        }
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
