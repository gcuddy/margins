export const load = async ({ url }: { url: URL }) => {
	const q = url.searchParams.get('q');
	return { q };
};
