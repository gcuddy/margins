
import type { Location } from "@prisma/client";
import { redirect } from "@sveltejs/kit";
import { TRPCError } from "@trpc/server";

import { createContext } from "$lib/trpc/context";
import { appRouter, createCaller } from "$lib/trpc/router";
import { groupBy } from "$lib/utils";
import { db } from "$lib/db";

import type { LayoutServerLoad } from "./$types";
import { trpc } from "$lib/trpc/client";

import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
    // runtime: "edge"
    runtime: "nodejs18.x"
}

export const load: LayoutServerLoad = async (event) => {
    const { locals, depends } = event;
    console.log(`(app)/layout.server.ts load function`);
    const theme = event.cookies.get("theme");
    // load settings
    event.depends("user:data");
    try {
        const client = await createCaller(event);
        const tags = client.user.getTags()
        const [user, states] = await Promise.all([client.user.getUser(), client.user.getStates()]);
        const locations = ["inbox", "soon", "later", "archive"];
        const sortedStates = states?.sort(
            (a, b) => locations.indexOf(a.type) - locations.indexOf(b.type)
        );
        const locationLookup = groupBy(sortedStates || [], (state) => state.type);
        const stateIdToLocation: Map<number, Location> = new Map((sortedStates || []).map((state) => [state.id, state.type]))
        const stateIdToName: Map<number, string> = new Map((sortedStates || []).map((state) => [state.id, state.name]))
        return {
            user: {
                ...user,
                states: sortedStates,
                locationLookup,
                stateIdToLocation,
                stateIdToName,
                tags,
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
