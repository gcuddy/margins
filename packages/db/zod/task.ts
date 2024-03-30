import * as z from 'zod';

export const TaskModel = z.object({
	id: z.number().int(),
});
