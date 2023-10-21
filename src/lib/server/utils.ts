import type { RequestEvent } from '@sveltejs/kit';
import type { z } from 'zod';

export type Query<TSchema extends z.ZodTypeAny, TData> = {
	// defaults to TRUE
	authorized?: boolean;
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
