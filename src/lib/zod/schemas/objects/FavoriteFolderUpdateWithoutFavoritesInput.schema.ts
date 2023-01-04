import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutFavoriteFoldersNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutFavoriteFoldersNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpdateWithoutFavoritesInput> = z
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
		user: z
			.lazy(() => UserUpdateOneRequiredWithoutFavoriteFoldersNestedInputObjectSchema)
			.optional(),
	})
	.strict();

export const FavoriteFolderUpdateWithoutFavoritesInputObjectSchema = Schema;
