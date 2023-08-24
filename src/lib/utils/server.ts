import { type RequestEvent, error } from '@sveltejs/kit';
import { parse } from 'devalue';
import type { z } from 'zod';

export async function queryctx<T extends z.ZodTypeAny>(
	req: RequestEvent,
	authed?: boolean
): Promise<{
	input: z.infer<T>;
	ctx: {
		userId: string;
	};
}>;
export async function queryctx<T extends z.ZodTypeAny>(
	req: RequestEvent,
	schema?: T,
	authed?: boolean
): Promise<{
	input: z.infer<T>;
	ctx: {
		userId: string;
	};
}>;
export async function queryctx<T extends z.ZodTypeAny>(
	req: RequestEvent,
	schemaOrAuthed?: T | boolean,
	authed?: boolean
): Promise<{
	input: z.infer<T>;
	ctx: {
		userId: string;
	};
}> {
	const { url, locals } = req;
	let userId = url.searchParams.get('userId');
	const schema = typeof schemaOrAuthed === 'boolean' ? undefined : schemaOrAuthed;
	const _authed = typeof schemaOrAuthed === 'boolean' ? schemaOrAuthed : authed;
	if (!userId && _authed !== false) {
		console.time(`[auth] validating session`);
		const session = await locals.auth.validate();
		console.timeEnd(`[auth] validating session`);
		if (!session) {
			throw error(401);
		}
		userId = session.user.userId;
	}
	if (!schema) {
		return {
			input: null,
			ctx: {
				userId: userId!
			}
		};
	}
	const input = url.searchParams.get('input');
	// console.log({ input })
	if (!input) {
		console.warn('Provided schema but missing input');
		return {
			input: null,
			ctx: {
				userId: userId!
			}
		};
		// throw error(400, "Missing input");
	}
	const data = parse(input) as unknown;
	// console.dir({ data }, { depth: null });
	const parsed = schema.safeParse(data);
	// console.log({ parsed })
	if (!parsed.success) {
		console.log(`Error parsing data:`, data);
		throw error(400, "Data doesn't match schema");
	}
	return {
		input: parsed.data as z.infer<T>,
		ctx: {
			userId: userId!
		}
	};
}

export async function mutationctx<T extends z.ZodTypeAny>(
	req: RequestEvent,
	schema?: T
): Promise<{
	input: z.infer<T>;
	ctx: {
		userId: string;
	};
}> {
	const raw = await req.request.text();
	const data = parse(raw);
	const { locals } = req;
	let { userId, input } = data;
	if (!userId) {
		const session = await locals.auth.validate();
		if (!session) {
			throw error(401);
		}
		userId = session.user.userId;
	}
	if (!schema) {
		return {
			input: null,
			ctx: {
				userId
			}
		};
	}
	if (!input) {
		console.warn('Provided schema but missing input');
		return {
			input: null,
			ctx: {
				userId
			}
		};
		// throw error(400, "Missing input");
	}
	const parsed = schema.safeParse(input);
	if (!parsed.success) {
		console.log(`Error parsing data:`, data);
		console.dir({ error: parsed.error }, { depth: null });
		throw error(400, "Data doesn't match schema");
	}
	return {
		input: parsed.data,
		ctx: {
			userId
		}
	};
}
