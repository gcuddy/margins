import type { PageLoad } from "./$types";

export const load = (async ({ url }) => {
	const accessToken = url.searchParams.get("access_token");
	return {
		accessToken,
	};
}) satisfies PageLoad;
