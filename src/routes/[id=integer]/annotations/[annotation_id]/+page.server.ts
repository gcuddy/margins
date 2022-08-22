import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
export const load: PageServerLoad = async ({ params }) => {
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
			annotation
		};
	}
};

// Again, for post, patch, and delete, see /annotations endpoint
