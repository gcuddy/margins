import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q');
	console.log({ q });
	if (!q) {
		return {
			status: 200,
			body: {
				results: []
			}
		};
	}
	const results = await db.article.findMany({
		where: {
			textContent: {
				search: q
			},
			title: {
				search: q
			}
		},
		include: {
			tags: true
		}
	});
	console.time('searchMatching');
	const matches = results.map((result) => {
		const regex = new RegExp(q, 'gi');
		const title = result.title.replace(regex, '<mark class="bg-primary-100">$&</mark>');
		const contentMatches = result.textContent.search(regex);
		let content = '';
		if (contentMatches > 0) {
			// todo: make much more sophisticated
			content = result.textContent.substring(contentMatches - 50, contentMatches + 50).trim();
			// now highlight the matched content
			content = content.replace(new RegExp(q, 'gi'), '<mark class="bg-primary-100">$&</mark>');
		}
		return {
			title,
			content
		};
	});
	console.timeEnd('searchMatching');
	// results.forEach((result) => {
	// 	console.log(result.title);
	// 	const regex = new RegExp('[^.]*[^.]*.', 'gi');
	// 	// get match with surrounding sentence
	// 	const match = result.textContent.match(regex);

	// 	result.textContent.match(q)?.forEach((match) => {
	// 		console.log(match);
	// 	});
	// });
	return {
		status: 200,
		body: {
			results,
			matches
		}
	};
};
