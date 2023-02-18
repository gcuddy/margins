import type { LayoutLoad } from "./$types";

export const load = (async () => {
	return {
		title: "Integrations",
	};
}) satisfies LayoutLoad;
