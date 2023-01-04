import { z } from 'zod';
import { EntryCreateWithoutFeedInputObjectSchema } from './EntryCreateWithoutFeedInput.schema';
import { EntryUncheckedCreateWithoutFeedInputObjectSchema } from './EntryUncheckedCreateWithoutFeedInput.schema';
import { EntryCreateOrConnectWithoutFeedInputObjectSchema } from './EntryCreateOrConnectWithoutFeedInput.schema';
import { EntryUpsertWithWhereUniqueWithoutFeedInputObjectSchema } from './EntryUpsertWithWhereUniqueWithoutFeedInput.schema';
import { EntryCreateManyFeedInputEnvelopeObjectSchema } from './EntryCreateManyFeedInputEnvelope.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateWithWhereUniqueWithoutFeedInputObjectSchema } from './EntryUpdateWithWhereUniqueWithoutFeedInput.schema';
import { EntryUpdateManyWithWhereWithoutFeedInputObjectSchema } from './EntryUpdateManyWithWhereWithoutFeedInput.schema';
import { EntryScalarWhereInputObjectSchema } from './EntryScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUncheckedUpdateManyWithoutFeedNestedInput> = z
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
		upsert: z
			.union([
				z.lazy(() => EntryUpsertWithWhereUniqueWithoutFeedInputObjectSchema),
				z.lazy(() => EntryUpsertWithWhereUniqueWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryCreateManyFeedInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => EntryUpdateWithWhereUniqueWithoutFeedInputObjectSchema),
				z.lazy(() => EntryUpdateWithWhereUniqueWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => EntryUpdateManyWithWhereWithoutFeedInputObjectSchema),
				z.lazy(() => EntryUpdateManyWithWhereWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => EntryScalarWhereInputObjectSchema),
				z.lazy(() => EntryScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryUncheckedUpdateManyWithoutFeedNestedInputObjectSchema = Schema;
