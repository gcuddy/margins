import { error, json } from '@sveltejs/kit';

import type { ValidatedAnnotationInput } from '$lib/annotation';
import { db } from '$lib/db';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	const annotations = await db.annotation.findMany({
		where: {
			userId: session.userId,
		},
	});
	return json(annotations);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	try {
		const data: ValidatedAnnotationInput = await request.json();
		const annotation = await db.annotation.create({
			data,
		});
		return json(annotation);
	} catch (e) {
		console.error(e);
		throw error(400, 'Malformed request');
	}
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	try {
		const data = await request.json();
		// TODO: Upsert
		// return json(annotation);
	} catch (e) {
		console.error(e);
		throw error(400, 'Malformed request');
	}
};
