export async function load(event) {
	const session = event.locals.session;
	return {
		session,
	};
}
