import { z } from 'zod';
import { SERVICE_NAME } from '$lib/api/hypothesis';

export const hypothesisSchema = z.object({
	apiKey: z.string(),
});

export const hypothesisSettingsSchema = z.object({
	groups: z.array(z.string()).default([]),
});

export type HypothesisSettings = z.infer<typeof hypothesisSettingsSchema>;

export const hypothesisIntegrationSchema = z.object({
	accessToken: z.string(),
	serviceName: z.literal(SERVICE_NAME).default('hypothesis').readonly(),
	settings: hypothesisSettingsSchema.optional(),
});
