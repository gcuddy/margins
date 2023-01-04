import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { FavoriteUpdateManyWithoutFolderNestedInputObjectSchema } from './FavoriteUpdateManyWithoutFolderNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpdateWithoutUserInput> = z
	.object({
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		favorites: z.lazy(() => FavoriteUpdateManyWithoutFolderNestedInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderUpdateWithoutUserInputObjectSchema = Schema;
