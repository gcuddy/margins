import type { PageLoad } from "./$types";

export const load = (async (evt) => {
	const { params } = evt;
	const { id } = params;
	return {
		id: +id,
	};
}) satisfies PageLoad;
