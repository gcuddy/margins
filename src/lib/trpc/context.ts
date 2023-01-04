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
			subscriptions: {
				select: {
					feedId: true
				}
			},
			username: true,
			bookmarks: {
				select: {
					id: true
				}
			},

		}
	})
	if (!user) {
		return null;
	}
	return {
		...user,
		feeds: user.subscriptions.map(s => s.feedId)
	}

}

export async function createContext(event: RequestEvent) {
	const session = await event.locals.validate();
	// const user = await getUser(session);
	return {
		// context information
		userId: session?.userId || '',
		prisma: db,
		// user,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
