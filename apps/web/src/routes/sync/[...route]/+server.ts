// This file serves as a proxy to our realtime sync.

import { PARTYKIT_URL } from '$lib/env';

export async function GET({ fetch, url }) {
	console.log('got sync request', url);

	return Response.json({
		url: url.toString(),
	});
}

export async function POST({ fetch, params, locals, request, url }) {
  const data = await request.json()

  let auth = request.headers.get("Authorization") || ""
  let roomId = request.headers.get("x-margins-room") || ""

  if (!auth && locals.session) {
    auth = `Bearer ${locals.session.id}`
  }
  if (!roomId && locals.user) {
    roomId = locals.user.id
  }

  console.log(url, { auth, roomId })

  if (!roomId) {
    return new Response("No room ID", { status: 400 })
  }

  // TODO: parties routes...
  const res = await fetch(
    `${PARTYKIT_URL}/parties/main/${roomId}/${params.route}`,
    {
      body: JSON.stringify(data),
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  )

  console.log({ res })
  const returnedData = await res.json()
  console.dir("returned data", data)

  return Response.json(returnedData)
}
