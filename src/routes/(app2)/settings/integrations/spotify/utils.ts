export function hasTokenExpired({
	expiresIn,
	timestamp,
}: {
	expiresIn: number | null;
	timestamp: Date | null;
}) {
	if (!expiresIn) {
		return false;
	}
	if (!timestamp) {
		return true;
	}
	console.log({ expiresIn, timestamp });
	const msElapsed = Date.now() - new Date(timestamp).getTime();

	return msElapsed / 1000 > expiresIn;
}
