import * as z from 'zod';

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const FeedModel = z.object({
	id: z.number().int(),
	feedUrl: z.string().nullish(),
	title: z.string().nullish(),
	link: z.string().nullish(),
	creator: z.string().nullish(),
	description: z.string().nullish(),
	lastBuildDate: z.date().nullish(),
	imageUrl: z.string().nullish(),
	podcast: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	active: z.boolean(),
	/**
	 * Velocity refers to the amount of times a feed is published per day.
	 */
	velocity: z.number().int().nullish(),
	/**
	 * IF we're using a podcast, then we use podcastIndex to save/index entries. Do we even need to save them into our db? Probably — what if pidx goes down, or something.
	 */
	podcastIndexId: z.number().int().nullish(),
	/**
	 * Store lastParsed time to diff against feed updated time
	 */
	lastParsed: z.date().nullish(),
	/**
	 * Additional data provided by podcastIndex
	 */
	podcastIndexData: jsonSchema,
	guid: z.string().nullish(),
	itunesId: z.number().int().nullish(),
	/**
	 * Deprecated
	 */
	itunes_id: z.string().nullish(),
});
