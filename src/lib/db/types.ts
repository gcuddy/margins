import type { RequestEvent } from '@sveltejs/kit';
import type { z } from 'zod';

export type Ctx = {
	ctx: {
        event: RequestEvent;
		userId: string;
	};
};

export type GetCtx<TSchema extends z.ZodTypeAny> = {
	input: z.infer<TSchema>;
} & Ctx;
