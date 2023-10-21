/* eslint-disable no-console */
import { error, type RequestEvent } from '@sveltejs/kit';
import { parse } from 'devalue';
import type { User } from 'lucia';
import { z } from 'zod';

export async function queryctx<T extends z.ZodTypeAny>(
	req: RequestEvent,
	authed?: boolean,
): Promise<{
	ctx: {
		userId: string;
	};
	input: z.infer<T>;
}>;
export async function queryctx<T extends z.ZodTypeAny>(
	req: RequestEvent,
	schema?: T,
	authed?: boolean,
): Promise<{
	ctx: {
		userId: string;
		user: User;
	};
	input: z.infer<T>;
}>;
export async function queryctx<T extends z.ZodTypeAny>(
	req: RequestEvent,
	schemaOrAuthed?: T | boolean,
	authed?: boolean,
): Promise<{
	ctx: {
		event: RequestEvent;
		userId: string;
		user: User;
	};
	input: z.infer<T>;
}> {
	const { url, locals } = req;
	let userId = url.searchParams.get('userId');
	let user: User | null = null;
	const schema =
		typeof schemaOrAuthed === 'boolean' ? undefined : schemaOrAuthed;
	const _authed = typeof schemaOrAuthed === 'boolean' ? schemaOrAuthed : authed;
	if (!userId && _authed !== false) {
		console.time(`[auth] validating session`);
		const session = await locals.auth.validate();
		console.timeEnd(`[auth] validating session`);
		if (!session) {
			throw error(401);
		}
		userId = session.user.userId;
		user = session.user;
	}
	if (!schema) {
		return {
			ctx: {
				event: req,
				userId: userId!,
				user: user!,
			},
			input: null,
		};
	}
	const input = url.searchParams.get('input');
	// console.log({ input })
	if (!input) {
		console.warn('Provided schema but missing input');
		return {
			ctx: {
				event: req,
				userId: userId!,
				user: user!,
			},
			input: null,
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
		ctx: {
			event: req,
			userId: userId!,
			user: user!,
		},
		input: parsed.data as z.infer<T>,
	};
}

const mutationInput = z.object({
	input: z.unknown(),
	userId: z.string().nullish(),
});

export async function mutationctx<TSchema extends z.ZodTypeAny>(
	req: RequestEvent,
	schema?: TSchema,
): Promise<{
	ctx: {
		event: RequestEvent;
		userId: string;
	};
	input: z.infer<TSchema>;
}> {
	const raw = await req.request.text();
	const data = mutationInput.parse(parse(raw));
	const { locals } = req;
	let { userId } = data;
	const { input } = data;
	if (!userId) {
		try {
			const session = await locals.auth.validate();
			if (!session) {
				throw error(401);
			}
			userId = session.user.userId;
		} catch (e) {
			throw error(401);
		}
	}
	if (!schema) {
		return {
			ctx: {
				event: req,
				userId,
			},
			input: null,
		};
	}
	if (!input) {
		console.warn('Provided schema but missing input');
		return {
			ctx: {
				event: req,
				userId,
			},
			input: null,
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
		ctx: {
			event: req,
			userId,
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		input: parsed.data,
	};
}
