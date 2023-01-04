import { z } from 'zod';
import { ContextNodeCreateWithoutOwnerInputObjectSchema } from './ContextNodeCreateWithoutOwnerInput.schema';
import { ContextNodeUncheckedCreateWithoutOwnerInputObjectSchema } from './ContextNodeUncheckedCreateWithoutOwnerInput.schema';
import { ContextNodeCreateOrConnectWithoutOwnerInputObjectSchema } from './ContextNodeCreateOrConnectWithoutOwnerInput.schema';
import { ContextNodeCreateManyOwnerInputEnvelopeObjectSchema } from './ContextNodeCreateManyOwnerInputEnvelope.schema';
import { ContextNodeWhereUniqueInputObjectSchema } from './ContextNodeWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeUncheckedCreateNestedManyWithoutOwnerInput> = z
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
		createMany: z.lazy(() => ContextNodeCreateManyOwnerInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema),
				z.lazy(() => ContextNodeWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const ContextNodeUncheckedCreateNestedManyWithoutOwnerInputObjectSchema = Schema;
