import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { url } = params;
	return {
		body: {
			url
		}
	};
};
