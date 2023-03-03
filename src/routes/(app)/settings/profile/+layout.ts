import type { LayoutLoad } from "./$types";

export const load = (async () => {
	return {
		title: "Profile",
	};
}) satisfies LayoutLoad;
