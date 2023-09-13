import { z } from 'zod';

export const stringComparatorSchema = z.object({
	contains: z.string().optional(),
	eq: z.string().optional(),
	in: z.array(z.string()).optional(),
	ncontains: z.string().optional(),
	neq: z.string().optional(),
	nin: z.array(z.string()).optional(),
	nstartsWith: z.string().optional(),
	startsWith: z.string().optional(),
});
// .or(z.string()); // if given a string, we use it for contains?

export type StringComparator = z.infer<typeof stringComparatorSchema>;

// TODO think about how to handle number vs string without being so verbose
export const idComparatorSchema = z.object({
	eq: z.number().optional(),
	in: z.array(z.number()).optional(),
	neq: z.number().optional(),
	nin: z.array(z.number()).optional(),
});
export const uidComparatorSchema = z.object({
	eq: z.string().optional(),
	in: z.array(z.string()).optional(),
	neq: z.string().optional(),
	nin: z.array(z.string()).optional(),
});

export const dateComparatorSchema = z.object({
	eq: z.coerce.date().optional(),
	gt: z.coerce.date().optional(),
	gte: z.coerce.date().optional(),
	in: z.array(z.coerce.date()).optional(),
	lt: z.coerce.date().optional(),
	lte: z.coerce.date().optional(),
	neq: z.coerce.date().optional(),
	nin: z.array(z.coerce.date()).optional(),
});

const comparators = z.union([
	stringComparatorSchema,
	idComparatorSchema,
	dateComparatorSchema,
]);

export type Comparator = z.infer<typeof comparators> | string;
