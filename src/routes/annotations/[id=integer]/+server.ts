import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		const deletedAnnotation = await db.annotation.delete({
			where: {
				id: parseInt(id)
			}
		});
		return {
			status: 200,
			body: deletedAnnotation
		};
	} catch (e) {
		console.error(e);
		return {
			status: 500
		};
	}
};
