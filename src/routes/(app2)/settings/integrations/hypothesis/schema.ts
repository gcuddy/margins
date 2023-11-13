import { z } from 'zod';

export const hypothesisSchema = z.object({
	apiKey: z.string(),
});
