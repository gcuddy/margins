// lib/trpc/context.ts
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType, Maybe } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { db } from "$lib/db";
import type { Session } from 'lucia-auth';

async function getUser(sesh: Maybe<Session>) {
	if (!sesh) {
		return null;
	}
	const user = await db.user.findUnique({
		where: {
			id: sesh.userId
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
					type: true
				}
			}
		}
	})
	if (!user) {
		return null;
	}
	return {
		...user,
	}

}

export async function createContext(event: RequestEvent) {
	const session = await event.locals.validate();
	console.log(`trpc-context`, { event, session })

	// REVIEW: this is what cal.com does, but is it a bad idea for speed to do this?
	const user = await getUser(session);
	console.log(`trpc-context`, { user })
	return {
		// context information
		userId: session?.userId || '',
		prisma: db,
		user,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
