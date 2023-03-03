import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent }) => {
	const data = await parent();
	return {
		title: "Highlight Colors",
		...data,
		subtitle: "Add descriptions to highlight colors",
	};
};
