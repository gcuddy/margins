export const load = async ({ url }) => {
	const rowCol = url.searchParams.get('row-col');
	return {
		rowCol
	};
};
