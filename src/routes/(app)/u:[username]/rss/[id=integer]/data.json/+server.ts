import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	console.log('fetching feed data');
	try {
		const feed = await db.rssFeed.findFirst({
			where: {
				id: parseInt(id),
			},
			include: {
				favorite: true,
			},
		});
		console.log({ feed });
		return json(feed);
	} catch (e) {
		console.error(e);
		return json(e);
	}
};
