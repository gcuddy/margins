import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutFavoriteFoldersNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutFavoriteFoldersNestedInput.schema';
import { FavoriteUpdateManyWithoutFolderNestedInputObjectSchema } from './FavoriteUpdateManyWithoutFolderNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpdateInput> = z
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
		favorites: z.lazy(() => FavoriteUpdateManyWithoutFolderNestedInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderUpdateInputObjectSchema = Schema;
