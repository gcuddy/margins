import type { DocumentType } from "@prisma/client";
import { z, ZodTypeAny } from "zod";

import { clarifyStringOrObject } from "./helpers";

const schemaRegex = /https?:\/\/schema\.org\/?/;
const baseSchema = z.object({
	"@context": z.string().regex(schemaRegex),
});

export const imageObjectSchema = z
	.object({
		"@type": z.literal("ImageObject"),
		url: z.string(),
		height: z.number(),
		width: z.number(),
	})
	.partial()
	.required({
		"@type": true,
	});

export const imageSchema = z
	.string()
	.or(imageObjectSchema)
	.or(z.array(z.string()))
	.or(z.array(imageObjectSchema));

export const personSchema = z.object({ "@type": z.literal("Person"), name: z.string() });

const durationSchema = z.object({
	"@type": z.literal("Duration"),
	maxValue: z.string(),
	minValue: z.string(),
});

const howToSteps = z.array(
	z
		.object({
			"@type": z.literal("HowToStep"),
			text: z.string(),
			name: z.string(),
			url: z.string(),
			image: imageSchema,
		})
		.partial()
		.required({
			"@type": true,
			text: true,
		})
);

const howToSections = z
	.object({
		"@type": z.literal("HowToSection"),
		itemListElement: howToSteps,
		name: z.string().optional(),
	})
	.array();

const stringish = z.string().or(z.string().array());

const extendedSchema = z
	.object({
		name: z.string(),
		image: imageSchema,
		author: personSchema.or(z.array(personSchema)),
		datePublished: z.string(),
		description: z.string(),
		prepTime: z.string().or(durationSchema),
		cookTime: z.string().or(durationSchema),
		totalTime: z.string().or(durationSchema),
		keywords: stringish,
		recipeYield: stringish,
		recipeCategory: z.string().or(z.array(z.string())),
		recipeCuisine: z.string().or(z.array(z.string())),
		nutrition: z.object({ "@type": z.string(), calories: z.string().or(z.number()) }),
		recipeIngredient: z.array(z.string()),
		recipeInstructions: howToSections.or(howToSteps),
		aggregateRating: z.object({
			"@type": z.string(),
			ratingValue: z.string().or(z.number()),
			ratingCount: z.string().or(z.number()),
		}),
		video: z.object({
			"@type": z.string(),
			name: z.string(),
			description: z.string(),
			thumbnailUrl: z.string().or(z.array(z.string())),
			contentUrl: z.string(),
			embedUrl: z.string(),
			uploadDate: z.string(),
			duration: z.string(),
			interactionStatistic: z.object({
				"@type": z.string(),
				interactionType: z.object({ "@type": z.string() }),
				userInteractionCount: z.number(),
			}),
			expires: z.string(),
		}),
	})
	.deepPartial()
	.required({
		name: true,
		// image: true,
	});

const recipeBaseSchema = z.object({
	"@context": z.string().regex(schemaRegex),
	"@type": z
		.literal("Recipe")
		.or(z.array(z.string()).refine((types) => types.some((type) => type === "Recipe"))),
});
export const recipeSchema = recipeBaseSchema.and(extendedSchema);

export type Recipe = z.infer<typeof recipeSchema>;

export const bookSchema = baseSchema.extend({
	"@type": z.literal("Book"),
	name: z.string(),
	image: imageSchema,
	author: personSchema.array(),
	isbn: z.string().optional(),
});

// const lookup = () => new Map([
// 	["Book", bookSchema],
// 	["Recipe", recipeSchema],
// ]);

const l = {
	Book: {
		schema: bookSchema,
		type: "book",
	},
	Recipe: {
		schema: recipeSchema,
		type: "article",
	},
} as const satisfies Record<
	string,
	{
		schema: ZodTypeAny;
		type: DocumentType;
	}
>;

export const schemaOrgSchemas = z.union([bookSchema, recipeSchema]);

const lookupFn = () => new Map(Object.entries(l));
export const lookup = lookupFn();

type Schema = z.infer<(typeof l)[keyof typeof l]["schema"]>;

// type Book = z.infer<typeof bookSchema>;

export const getSchemas = (jsons: any[]) => {
	return jsons
		.map((json) => {
			const obj = clarifyStringOrObject(json?.["@type"]);
			if (typeof obj === "string") {
				const record = lookup.get(obj);
				console.log({ record });
				if (record) {
					const { schema, type } = record;
					try {
						return {
							type,
							schema: schema.parse(json),
						};
					} catch (e) {
						console.error(e);
					}
				}
			}
			if (Array.isArray(obj)) {
				const record = lookup.get(obj.find((t) => lookup.has(t)));
				if (record) {
					const { schema, type } = record;
					try {
						return {
							type,
							schema: schema.parse(json),
						};
					} catch (e) {
						console.error(e);
					}
				}
			}
		})
		.filter(Boolean) as { type: DocumentType; schema: Schema }[];
};
