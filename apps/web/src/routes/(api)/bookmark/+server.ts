export async function POST({ locals }) {
	const { db } = locals;

	return new Response('ok', {
		status: 200,
	});
}
