export async function POST({ locals, url }) {
	const _url = url.searchParams.get('url');
	if (!_url) {
		return new Response('url is required', { status: 400 });
	}

	return new Response('ok', {
		status: 200,
	});
}
