import { z } from 'zod';
import { ContextNodeCreateWithoutOwnerInputObjectSchema } from './ContextNodeCreateWithoutOwnerInput.schema';
import { ContextNodeUncheckedCreateWithoutOwnerInputObjectSchema } from './ContextNodeUncheckedCreateWithoutOwnerInput.schema';
import { ContextNodeCreateOrConnectWithoutOwnerInputObjectSchema } from './ContextNodeCreateOrConnectWithoutOwnerInput.schema';
import { ContextNodeUpsertWithWhereUniqueWithoutOwnerInputObjectSchema } from './ContextNodeUpsertWithWhereUniqueWithoutOwnerInput.schema';
import { ContextNodeCreateManyOwnerInputEnvelopeObjectSchema } from './ContextNodeCreateManyOwnerInputEnvelope.schema';
import { ContextNodeWhereUniqueInputObjectSchema } from './ContextNodeWhereUniqueInput.schema';
import { ContextNodeUpdateWithWhereUniqueWithoutOwnerInputObjectSchema } from './ContextNodeUpdateWithWhereUniqueWithoutOwnerInput.schema';
import { ContextNodeUpdateManyWithWhereWithoutOwnerInputObjectSchema } from './ContextNodeUpdateManyWithWhereWithoutOwnerInput.schema';
import { ContextNodeScalarWhereInputObjectSchema } from './ContextNodeScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeUncheckedUpdateManyWithoutOwnerNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => ContextNodeCreateWithoutOwnerInputObjectSchema),
				z.lazy(() => ContextNodeCreateWithoutOwnerInputObjectSchema).array(),
				z.lazy(() => ContextNodeUncheckedCreateWithoutOwnerInputObjectSchema),
				z.lazy(() => ContextNodeUncheckedCreateWithoutOwnerInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ContextNodeCreateOrConnectWithoutOwnerInputObjectSchema),
				z.lazy(() => ContextNodeCreateOrConnectWithoutOwnerInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => ContextNodeUpsertWithWhereUniqueWithoutOwnerInputObjectSchema),
				z.lazy(() => ContextNodeUpsertWithWhereUniqueWithoutOwnerInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ContextNodeCreateManyOwnerInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema),
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema),
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema),
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema),
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => ContextNodeUpdateWithWhereUniqueWithoutOwnerInputObjectSchema),
				z.lazy(() => ContextNodeUpdateWithWhereUniqueWithoutOwnerInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => ContextNodeUpdateManyWithWhereWithoutOwnerInputObjectSchema),
				z.lazy(() => ContextNodeUpdateManyWithWhereWithoutOwnerInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => ContextNodeScalarWhereInputObjectSchema),
				z.lazy(() => ContextNodeScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const ContextNodeUncheckedUpdateManyWithoutOwnerNestedInputObjectSchema = Schema;
