// lib/trpc/context.ts
import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType, Maybe } from "@trpc/server";
import type { Session } from "lucia-auth";

import { db } from "$lib/db";

async function getUser(sesh: Maybe<Session>) {
	if (!sesh) {
		return null;
	}
	const user = await db.user.findUnique({
		where: {
			id: sesh.userId,
		},
		select: {
			// subscriptions: {
			// 	select: {
			// 		feedId: true
			// 	}
			// },
			// username: true,
			// bookmarks: {
			// 	select: {
			// 		id: true
			// 	}
			// },
			username: true,
			default_state_id: true,
			states: {
				select: {
					id: true,
					name: true,
					type: true,
				},
			},
		},
	});
	if (!user) {
		return null;
	}
	return {
		...user,
	};
}

export async function createContext(event: RequestEvent) {
    console.log(`createContext()`)
	const session = await event.locals.validateUser();
    console.log({session})
	// REVIEW: this is what cal.com does, but is it a bad idea for speed to do this?
	// const user = await getUser(session);
	return {
		// context informationj
		userId: session?.session?.userId || "",
		prisma: db,
        user: session?.user
		// user,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
