import type { RequestEvent } from '@sveltejs/kit';
import type { z } from 'zod';

export type Ctx = {
	ctx: {
		event?: RequestEvent;
		userId: string;
	};
};

export type GetCtx<TSchema extends z.ZodTypeAny> = {
	input: z.infer<TSchema>;
} & Ctx;



export type Query<TSchema extends z.ZodTypeAny, TData> = {
	// defaults to TRUE
	authorized?: boolean | 'optional';
	fn: (args: {
		ctx: {
			event: RequestEvent;
			userId: string;
		};
		input: z.infer<TSchema>;
	}) => Promise<TData>;
	headers?: Record<string, string>;
	schema?: TSchema;
	staleTime?: number;
};

// TODO: rename this to "procedure"
export const query = <TSchema extends z.ZodTypeAny, TData>(
	args: Query<TSchema, TData>,
) => args;
