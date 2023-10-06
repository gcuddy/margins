import { z } from 'zod';

export const stringComparatorSchema = z.object({
	contains: z.string().optional(),
	eq: z.string().optional(),
	in: z.array(z.string()).optional(),
	ncontains: z.string().optional(),
	neq: z.string().optional(),
	nin: z.array(z.string()).optional(),
	nstartsWith: z.string().optional(),
	/** Search ONLY works with full-text search fields. Will throw error otherwise. */
	search: z.string().optional(),

	startsWith: z.string().optional(),
});
// .or(z.string()); // if given a string, we use it for contains?

export type StringComparator = z.infer<typeof stringComparatorSchema>;

export const stringComparatorShape = stringComparatorSchema.shape;

export const stringComparatorKeys = Object.keys(
	stringComparatorSchema.shape,
) as Array<keyof StringComparator>;

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

// TODO: constrain input to string | number?
// TODO: the naming on this is potentially confusing since array refers to the in/nin part, not the itemschema
// TODO: optionally allow "every" or "some" for array comparators
export function createArrayComparatorSchema<ItemType extends z.ZodTypeAny>(
	itemSchema: ItemType,
) {
	return z.object({
		in: z.array(itemSchema).optional(),
		nin: z.array(itemSchema).optional(),
	});
}

const comparators = z.union([
	stringComparatorSchema,
	idComparatorSchema,
	dateComparatorSchema,
]);

export type Comparator = z.infer<typeof comparators> | string;

export const comparatorToDisplay = {
	contains: 'contains',
	eq: 'is',
	gt: 'greater than',
	gte: 'greater than or equal to',
	in: 'in',
	lt: 'less than',
	lte: 'less than or equal to',
	ncontains: 'does not contain',
	neq: 'does not equal',
	nin: 'not in',
	nstartsWith: 'does not start with',
	search: 'search',
	startsWith: 'starts with',
};
