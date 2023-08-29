import type { z } from 'zod';

export type Ctx = {
	ctx: {
		userId: string;
	};
};

export type GetCtx<TSchema extends z.ZodTypeAny> = {
	input: z.infer<TSchema>;
} & Ctx;
