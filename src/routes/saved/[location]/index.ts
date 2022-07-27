import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { Location } from '../types';

export const GET: RequestHandler = async ({ params, url }) => {
	let location = '';
	console.log('get request for lcoation: ', params);
	console.log(params.location);
	if (params.location.toUpperCase() === Location.INBOX) {
		location = Location.INBOX;
	} else if (params.location.toUpperCase() === Location.SOON) {
		location = Location.SOON;
	} else if (params.location.toUpperCase() === Location.LATER) {
		location = Location.LATER;
	} else if (params.location.toUpperCase() === Location.ARCHIVE) {
		location = Location.ARCHIVE;
	}
	console.log('location: ', location);
	if (!location) {
		return {
			status: 404
		};
	}
	const articles = await db.article.findMany({
		where: {
			location: params.location
		},
		include: {
			annotations: true,
			highlights: true,
			tags: true
		}
	});
	return {
		status: 200,
		body: {
			articles,
			location
		}
	};
};
