import { json } from '@sveltejs/kit';
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
		return json(deletedAnnotation);
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 500 });
	}
};
