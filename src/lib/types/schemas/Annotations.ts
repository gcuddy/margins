import type { Color } from "@prisma/client";
import { z } from "zod";

interface Selector {
	/**
	 * A Selector can be refined by another Selector.
	 *
	 * See {@link https://www.w3.org/TR/2017/REC-annotation-model-20170223/#refinement-of-selection
	 * | §4.2.9 Refinement of Selection} in the Web Annotation Data Model.
	 *
	 * Corresponds to RDF property {@link http://www.w3.org/ns/oa#refinedBy}
	 */
	refinedBy?: Selector;
}

// We have to use lazy to do recursive
const Selector: z.ZodType<Selector> = z.lazy(() =>
	z.object({
		refinedBy: Selector.optional(),
	})
);

// But using z.lazy means we can't use extend,
// so I'm using .and instead.
// Does this make a big difference?

export const TextQuoteSelectorSchema = z.object({
	type: z.literal("TextQuoteSelector"),
	exact: z.string(),
	prefix: z.string().optional(),
	suffix: z.string().optional(),
});

// or other selectors, and make them all refinable by one of the selectors

export const BaseTargetSchema = z.object({
	source: z.string().url(),
});

// Targets
export const TextQuoteTarget = z.object({
	source: z.string(),
	html: z.string().optional(),
	// should we make this possible to be an array?
	selector: TextQuoteSelectorSchema,
});

export const TargetSchema = TextQuoteTarget.or(BaseTargetSchema);

export const Motivation = z.literal("describing").or(z.literal("highlighting"));

export const AnnotationSchema = z.object({
	body: z.string().optional().nullable(),
	// optionally can provide ID - then we will upsert
	id: z.number().optional(),
	articleId: z.number(),
	// Todo: abstract this out to a common schema
	target: TargetSchema,
	motivation: Motivation.nullable().optional(),
});

export const delSchema = z.object({
	id: z.number(),
});

export const HighlightColorValues: Record<Color, string> = {
	Yellow: "string",
};
