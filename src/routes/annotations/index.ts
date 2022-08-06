import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import type { Prisma } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

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
		refinedBy: Selector.optional()
	})
);

// But using z.lazy means we can't use extend,
// so I'm using .and instead.
// Does this make a big difference?

export const TextQuoteSelectorSchema = z.object({
	type: z.literal('TextQuoteSelector'),
	exact: z.string(),
	prefix: z.string().optional(),
	suffix: z.string().optional()
});

// or other selectors, and make them all refinable by one of the selectors

export const TargetSchema = z.object({
	source: z.string(),
	// should we make this possible to be an array?
	selector: TextQuoteSelectorSchema
});

export const annotationSchema = z.object({
	body: z.string().optional(),
	articleId: z.number(),
	// Todo: abstract this out to a common schema
	target: TargetSchema
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const json = await getJsonFromRequest(request);
		console.log({ json });
		const { body, articleId, target } = annotationSchema.parse(json);
		const createdAnnotation = await db.annotation.create({
			data: {
				body: body,
				articleId: articleId,
				target: target as Prisma.JsonObject
			}
		});
		return {
			status: 200,
			body: {
				annotation: createdAnnotation
			}
		};
	} catch (e) {
		console.error(e);
		return {
			status: 500
		};
	}
};
