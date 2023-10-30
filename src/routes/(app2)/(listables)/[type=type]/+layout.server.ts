export async function load(event) {
	const session = await event.locals.auth.validate();
	return {
		session,
	};
}
