import { z } from 'zod';
import { TagCreateWithoutFavoriteInputObjectSchema } from './TagCreateWithoutFavoriteInput.schema';
import { TagUncheckedCreateWithoutFavoriteInputObjectSchema } from './TagUncheckedCreateWithoutFavoriteInput.schema';
import { TagCreateOrConnectWithoutFavoriteInputObjectSchema } from './TagCreateOrConnectWithoutFavoriteInput.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateNestedOneWithoutFavoriteInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutFavoriteInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutFavoriteInputObjectSchema).optional(),
		connect: z.lazy(() => TagWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const TagCreateNestedOneWithoutFavoriteInputObjectSchema = Schema;
