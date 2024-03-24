import { update } from '$lib/feeds/server/update';

export async function POST() {
	// TODO: qstash authorization
	await update();

	return new Response();
}
