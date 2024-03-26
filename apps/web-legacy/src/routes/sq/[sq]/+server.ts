// RSS Router

import { error, text, json } from '@sveltejs/kit';

import { mutationctx, queryctx } from '$lib/utils/server';

import { mutations, queries } from '../../queries.server';
import type { RequestHandler } from './$types';
import { stringify } from 'devalue';

// Generalize this

export const GET: RequestHandler = async (event) => {
	const sq = event.params.sq;
	// fn should be key of queries
	if (!sq) {
		error(400, 'sq is required');
	}
	if (!(sq in queries)) {
		error(400, 'sq is not valid');
	}
	const query = queries[sq as keyof typeof queries];
	console.time(`[sq] ${sq}`);
	console.log(`running sq ${sq}`, new Date());
	const params = await queryctx(event, query.schema, query.authorized);
	console.time(`[sq - fn] ${sq}`);
	//@ts-expect-error - TODO this is some bug with the type system we currently have
	const result = await query.fn(params);
	console.timeEnd(`[sq - fn] ${sq}`);
	if (query.headers) {
		console.log(`setting headers for ${event.url.toString()}`);
		event.setHeaders(query.headers);
	}
	// console.dir({ result }, { depth: null });
	console.timeEnd(`[sq] ${sq}`);
	return text(stringify(result));
};

export const POST: RequestHandler = async (event) => {
	const sq = event.params.sq;
	// fn should be key of queries
	if (!sq) {
		error(400, 'sq is required');
	}
	if (!(sq in mutations)) {
		error(400, 'sq is not valid');
	}
	const mutation = mutations[sq as keyof typeof mutations];
	const params = await mutationctx(event, mutation.schema);

	//@ts-expect-error - TODO this is some bug with the type system we currently have
	const result = await mutation.fn(params);
	console.dir({ result }, { depth: null });
	return json(result || {});
};
