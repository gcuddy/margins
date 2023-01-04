import { z } from 'zod';
import { FeedUpdateOneRequiredWithoutSubscriptionsNestedInputObjectSchema } from './FeedUpdateOneRequiredWithoutSubscriptionsNestedInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionUpdateWithoutUserInput> = z
	.object({
		feed: z.lazy(() => FeedUpdateOneRequiredWithoutSubscriptionsNestedInputObjectSchema).optional(),
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		title: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		download_full: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)])
			.optional(),
	})
	.strict();

export const SubscriptionUpdateWithoutUserInputObjectSchema = Schema;
