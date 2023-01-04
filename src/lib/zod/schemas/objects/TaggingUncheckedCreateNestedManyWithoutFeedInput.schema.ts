import { z } from 'zod';
import { TaggingCreateWithoutFeedInputObjectSchema } from './TaggingCreateWithoutFeedInput.schema';
import { TaggingUncheckedCreateWithoutFeedInputObjectSchema } from './TaggingUncheckedCreateWithoutFeedInput.schema';
import { TaggingCreateOrConnectWithoutFeedInputObjectSchema } from './TaggingCreateOrConnectWithoutFeedInput.schema';
import { TaggingCreateManyFeedInputEnvelopeObjectSchema } from './TaggingCreateManyFeedInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUncheckedCreateNestedManyWithoutFeedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TaggingCreateWithoutFeedInputObjectSchema),
				z.lazy(() => TaggingCreateWithoutFeedInputObjectSchema).array(),
				z.lazy(() => TaggingUncheckedCreateWithoutFeedInputObjectSchema),
				z.lazy(() => TaggingUncheckedCreateWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TaggingCreateOrConnectWithoutFeedInputObjectSchema),
				z.lazy(() => TaggingCreateOrConnectWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TaggingCreateManyFeedInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TaggingUncheckedCreateNestedManyWithoutFeedInputObjectSchema = Schema;
