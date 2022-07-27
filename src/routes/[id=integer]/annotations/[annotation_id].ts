import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { z } from 'zod';
import { reportZodOrPrismaError } from '$lib/api-utils';
export const GET: RequestHandler = async ({ params }) => {
	// matches annotation id
	const id = parseInt(params.annotation_id);
	const annotation = await db.annotation.findUnique({
		where: {
			id
		},
		include: {
			article: true
		}
	});
	if (annotation) {
		return {
			status: 200,
			body: {
				annotation
			}
		};
	} else {
		return {
			status: 404,
			body: {
				error: 'Annotation not found'
			}
		};
	}
};

const annotationUpdateSchema = z.object({
	body: z.string()
});

// maybe this should be post, idk, but patch is probably proper
// api design, bro - pinboard for instance pretends patch doesn't exist lol
export const PATCH: RequestHandler = async ({ request, params }) => {
	// edit annotation
	// const json = await request.json();
	// console.log({ json });
	const data = await request.formData();
	const { body } = annotationUpdateSchema.parse({
		body: data.get('text')
		// text: json.text || data.get('text')
	});
	try {
		const annotation = await db.annotation.update({
			where: {
				id: parseInt(params.annotation_id)
			},
			data: {
				body
			}
		});
		return {
			status: 200,
			body: {
				annotation
			}
		};
	} catch (e) {
		return {
			status: 400,
			body: {
				error: reportZodOrPrismaError(e)
			}
		};
	}
};

const redirect = {
	status: 303,
	headers: {
		location: '/'
	}
};

// todo
// export const DELETE
// Deletes an annotation
export const DELETE: RequestHandler = async ({ request, params }) => {
	try {
		const articleId = parseInt(params.id);
		const body = await db.annotation.delete({
			where: {
				id: parseInt(params.annotation_id)
			}
		});
		console.log('deleting, then redirecting to:', `/${articleId}/annotations`);
		return {
			status: 303,
			body,
			headers: {
				location: `/${articleId}/annotations`
			}
		};
	} catch (e) {
		return {
			status: 400,
			body: {
				error: reportZodOrPrismaError(e)
			}
		};
	}
};
