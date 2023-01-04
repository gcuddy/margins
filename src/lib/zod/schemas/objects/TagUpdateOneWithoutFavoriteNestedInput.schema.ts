import { z } from 'zod';
import { TagCreateWithoutFavoriteInputObjectSchema } from './TagCreateWithoutFavoriteInput.schema';
import { TagUncheckedCreateWithoutFavoriteInputObjectSchema } from './TagUncheckedCreateWithoutFavoriteInput.schema';
import { TagCreateOrConnectWithoutFavoriteInputObjectSchema } from './TagCreateOrConnectWithoutFavoriteInput.schema';
import { TagUpsertWithoutFavoriteInputObjectSchema } from './TagUpsertWithoutFavoriteInput.schema';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagUpdateToOneWithWhereWithoutFavoriteInputObjectSchema } from './TagUpdateToOneWithWhereWithoutFavoriteInput.schema';
import { TagUpdateWithoutFavoriteInputObjectSchema } from './TagUpdateWithoutFavoriteInput.schema';
import { TagUncheckedUpdateWithoutFavoriteInputObjectSchema } from './TagUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateOneWithoutFavoriteNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutFavoriteInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutFavoriteInputObjectSchema).optional(),
		upsert: z.lazy(() => TagUpsertWithoutFavoriteInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => TagWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => TagWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => TagWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => TagUpdateToOneWithWhereWithoutFavoriteInputObjectSchema),
				z.lazy(() => TagUpdateWithoutFavoriteInputObjectSchema),
				z.lazy(() => TagUncheckedUpdateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const TagUpdateOneWithoutFavoriteNestedInputObjectSchema = Schema;
