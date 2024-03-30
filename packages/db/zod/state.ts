import * as z from 'zod';
import { State_type } from '@prisma/client';

export const StateModel = z.object({
	id: z.number().int(),
	/**
	 * Whether or not this state represents things to be looked at later.
	 * The name of the state
	 */
	name: z.string(),
	/**
	 * State's UI color as a hex string
	 */
	color: z.string().nullish(),
	/**
	 * The type of the state
	 */
	type: z.nativeEnum(State_type),
	/**
	 * The position of the state
	 */
	position: z.number(),
	description: z.string().nullish(),
	userId: z.string(),
	default: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
