// lib/trpc/context.ts
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import { TRPCError } from '@trpc/server';

export async function createContext(event: RequestEvent) {
	const session = await event.locals.validate();
	return {
		// context information
		userId: session?.userId || '',
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
