import { z } from 'zod';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { LocationSchema } from '../enums/Location.schema';
import { EnumLocationFieldUpdateOperationsInputObjectSchema } from './EnumLocationFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutStatesNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutStatesNestedInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BookmarkUpdateManyWithoutStateNestedInputObjectSchema } from './BookmarkUpdateManyWithoutStateNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpdateWithoutDefaultRelationInput> = z
	.object({
		read_later: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		color: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		type: z
			.union([
				z.lazy(() => LocationSchema),
				z.lazy(() => EnumLocationFieldUpdateOperationsInputObjectSchema),
			])
			.optional(),
		position: z
			.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		description: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutStatesNestedInputObjectSchema).optional(),
		default: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		bookmarks: z.lazy(() => BookmarkUpdateManyWithoutStateNestedInputObjectSchema).optional(),
	})
	.strict();

export const StateUpdateWithoutDefaultRelationInputObjectSchema = Schema;
