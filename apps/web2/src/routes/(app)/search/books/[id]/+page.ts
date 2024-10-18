export const load = async ({ params }) => {
	const id = params.id;
	console.log({ id });
	return {
		id: params.id
	};
};
