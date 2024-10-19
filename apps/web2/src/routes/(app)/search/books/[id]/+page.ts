import { runtime } from '$lib/runtime.js';
import { main } from './effect.js';

export const load = async ({ params }) => {
	const id = params.id;
	const promise = await runtime.runPromise(main(id));
	console.log({ promise });
	return {
		id: params.id
	};
};
