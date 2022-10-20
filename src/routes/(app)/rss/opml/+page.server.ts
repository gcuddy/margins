import { type Actions, invalid } from '@sveltejs/kit';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';
import { addFeed } from '../utils';

const opmlObject = z.object({
	opml: z.object({
		body: z.object({
			outline: z.array(
				z.object({
					text: z.string(),
					title: z.string(),
					type: z.string().optional(),
					xmlUrl: z.string().optional(),
				})
			),
		}),
	}),
});

export const actions: Actions = {
	submitOpml: async ({ request }) => {
		console.log('opml request');
		const data = await request.formData();
		const opml = data.get('opml') as Blob;
		const rawOpml = await opml.text();
		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: '',
		});
		const parsed = parser.parse(rawOpml);
		try {
			const validated = opmlObject.parse(parsed);
			console.log({ validated });
			return validated;
		} catch (e) {
			console.error(e);
			return invalid(400, {
				parsed,
				message: 'Invalid OPML',
			});
		}
	},
	submitUrls: async ({ request, locals }) => {
		const { userId } = locals.getSession();
		if (!userId) {
			return invalid(401, {
				message: 'Not logged in',
			});
		}
		const data = await request.formData();
		console.log({ data });
		const urls = data.getAll('url');
		Promise.all(urls.map(async (url) => addFeed(url as string, userId)));
	},
};
