// TODO
function cors(headers: Headers) {
	headers.set('Access-Control-Allow-Origin', '*');
	headers.set(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS',
	);
	headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
