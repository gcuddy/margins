import { json as json$1 } from '@sveltejs/kit';
import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { parse } from 'node-html-parser';

// export const GET: RequestHandler = async () => {};

export const POST: RequestHandler = async ({ request }) => {
	const schema = z.object({
		url: z.string(),
		title: z.string().optional(),
		description: z.string().optional(),
		html: z.string().optional(),
		articleId: z.number().optional(),
		tags: z.array(z.string()).optional()
	});
	console.log('bookmark');
	if (request) {
		const form = await request.formData();
		const url = <string>form.get('text');
		console.log(url);
		let body: any;
		if (!url) {
			body = await request.json();
		}
		if (body || url) {
			if (url) {
				body = { url };
			}
			const req = schema.parse(body);
			if (!req.html) req.html = await fetch(req.url).then((res) => res.text());
			if (!req.title && req.html) {
				const parsed = parse(req.html);
				req.title = parsed.querySelector('title')?.text;
			}
			// await getTitle(req.html);
			try {
				const bookmark = await db.bookmark.create({
					data: {
						...req,
						title: req.title || ''
					}
				});
				return json$1({
					bookmark
				});
			} catch (e) {
				console.log(e);
			}
		}
	}
	return new Response(undefined, { status: 404 });
};
