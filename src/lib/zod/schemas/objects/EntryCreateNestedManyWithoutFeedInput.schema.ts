import { z } from 'zod';
import { EntryCreateWithoutFeedInputObjectSchema } from './EntryCreateWithoutFeedInput.schema';
import { EntryUncheckedCreateWithoutFeedInputObjectSchema } from './EntryUncheckedCreateWithoutFeedInput.schema';
import { EntryCreateOrConnectWithoutFeedInputObjectSchema } from './EntryCreateOrConnectWithoutFeedInput.schema';
import { EntryCreateManyFeedInputEnvelopeObjectSchema } from './EntryCreateManyFeedInputEnvelope.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateNestedManyWithoutFeedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutFeedInputObjectSchema),
				z.lazy(() => EntryCreateWithoutFeedInputObjectSchema).array(),
				z.lazy(() => EntryUncheckedCreateWithoutFeedInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryCreateOrConnectWithoutFeedInputObjectSchema),
				z.lazy(() => EntryCreateOrConnectWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryCreateManyFeedInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryCreateNestedManyWithoutFeedInputObjectSchema = Schema;
