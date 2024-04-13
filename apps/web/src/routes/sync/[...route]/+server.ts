// This file serves as a proxy to our realtime sync.

import { PARTYKIT_URL } from '$lib/env';

export async function GET({ fetch, url }) {
	console.log('got sync request', url);

	return Response.json({
		url: url.toString(),
	});
}

export async function POST({ fetch, params, request, url }) {
	const data = await request.json();

	const auth = request.headers.get('Authorization') || '';
	const roomId = request.headers.get('x-margins-room') || '';
	console.log({ auth, roomId });

	if (!roomId) {
		return new Response('No room ID', { status: 400 });
	}

	// TODO: parties routes...
	const res = await fetch(
		`${PARTYKIT_URL}/parties/main/${roomId}/${params.route}`,
		{
			body: JSON.stringify(data),
			headers: {
				Authorization: auth,
				'Content-Type': 'application/json',
			},
			method: 'POST',
		},
	);

	console.log({ res });

	return Response.json(await res.json());
}
