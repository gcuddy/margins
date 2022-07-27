import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const domain = <string>data.get('domain');
	const css = <string>data.get('css');
	const rule = await db.css.create({
		data: {
			domain,
			css
		}
	});
	return {
		status: 200,
		body: {
			rule
		}
	};
};
