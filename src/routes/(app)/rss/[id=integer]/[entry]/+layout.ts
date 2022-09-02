export const load: LayoutLoad = async ({ params, parent }) => {
	const entry = params.entry;
	return {
		feedId: Number(params.id),
		entry,
	};
};
