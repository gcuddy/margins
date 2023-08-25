import type { z } from 'zod';

export type Ctx = {
	ctx: {
		userId: string;
	};
};

export type GetCtx<T extends z.ZodTypeAny> = {
	input: z.infer<T>;
} & Ctx;
