export const isValidUrl = (text: string) => {
	// console.log({ text })
	try {
		const u = new URL(text);
		return u.origin !== null && u.origin !== 'null';
	} catch {
		return false;
	}
};
