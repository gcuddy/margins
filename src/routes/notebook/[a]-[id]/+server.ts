import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ params, request, url }) => {
	console.log('hello test');
	console.log({ params, request, url });
	const { a, id } = params;
	console.log('received patch request', { a, id });
	const form = await request.formData();
	let json: any = {};
	const returnBody = {
		status: 303,
		headers: {
			Location: `/notebook`
		},
		body: null
	};
	if (form) {
		const body = form.get('body');
		if (body && typeof body === 'string') {
			json = JSON.parse(body);
		} else if (form.get('flag')) {
			// should probablhy think about a better way to organize this
			json = { flagged: JSON.parse(<string>form.get('flag')) };
		}
	} else {
		if (request.json) {
			json = await request.json();
		}
	}
	console.log('json', json);
	if (!id || !json) {
		return Object.assign(returnBody, { status: 400, body: { error: 'No body' } });
	}
	if (a === 'a') {
		const annotation = await db.annotation.update({
			where: {
				id: parseInt(id)
			},
			data: { ...json }
		});
		console.log({ annotation });
		return Object.assign(returnBody, { status: 200, body: annotation });
	} else if (a === 'h') {
		const highlight = await db.highlight.update({
			where: {
				id
			},
			data: { ...json }
		});
		console.log({ highlight });
		return Object.assign(returnBody, { status: 200, body: highlight });
	} else {
		return Object.assign(returnBody, {
			status: 303
		});
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	console.log('got del request');
	const { a, id } = params;
	console.log({ a, id });
	switch (a) {
		case 'a': {
			const annotation = await db.annotation.delete({
				where: {
					id: parseInt(id)
				}
			});
			console.log({ annotation });
			return {
				status: 200,
				body: annotation
			};
		}
		case 'h': {
			console.log('got highlight delete request');
			const highlight = await db.highlight.delete({
				where: {
					id
				}
			});
			console.log({ highlight });
			return {
				status: 200,
				body: highlight
			};
		}
	}
	return {
		status: 303
	};
};
