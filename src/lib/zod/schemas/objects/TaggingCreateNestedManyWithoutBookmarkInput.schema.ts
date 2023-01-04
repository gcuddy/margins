import { z } from 'zod';
import { TaggingCreateWithoutBookmarkInputObjectSchema } from './TaggingCreateWithoutBookmarkInput.schema';
import { TaggingUncheckedCreateWithoutBookmarkInputObjectSchema } from './TaggingUncheckedCreateWithoutBookmarkInput.schema';
import { TaggingCreateOrConnectWithoutBookmarkInputObjectSchema } from './TaggingCreateOrConnectWithoutBookmarkInput.schema';
import { TaggingCreateManyBookmarkInputEnvelopeObjectSchema } from './TaggingCreateManyBookmarkInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateNestedManyWithoutBookmarkInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TaggingCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => TaggingCreateWithoutBookmarkInputObjectSchema).array(),
				z.lazy(() => TaggingUncheckedCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => TaggingUncheckedCreateWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TaggingCreateOrConnectWithoutBookmarkInputObjectSchema),
				z.lazy(() => TaggingCreateOrConnectWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TaggingCreateManyBookmarkInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TaggingCreateNestedManyWithoutBookmarkInputObjectSchema = Schema;
