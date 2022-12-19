import { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

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

const PostSchema = z.object({
	name: z.string(),
	feedId: z.number().optional(),
	annotationid: z.number().optional(),
});

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	try {
		const rawData = await request.json();
		const data = PostSchema.parse(rawData);
		// expects name, and at least one of feedId and annotationId
		try {
			const tag = await db.taggings.create({
				data: {
					user: {
						connect: {
							id: session.userId,
						},
					},
					tag: {
						connectOrCreate: {
							where: {
								name_userId: {
									name: data.name,
									userId: session.userId,
								},
							},
							create: {
								name: data.name,
								userId: session.userId,
							},
						},
					},
					annotation: {
						connect: {
							id: data.annotationid,
						},
					},
					feed: {
						connect: {
							id: data.feedId,
						},
					},
				},
			});
			return json(tag);
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				// The .code property can be accessed in a type-safe manner
				if (e.code === 'P2002') {
					console.log('There is a unique constraint violation');
				}
				// todo: return 302 with existing one
			}
			throw e;
		}
	} catch (e) {
		console.error(e);
		throw error(400, 'Malformed request');
	}
};
