export function stripGoogleBookCurl(url?: string) {
	if (!url) return "";
	try {
		const u = new URL(url);
		u.searchParams.delete("edge");
		return u.toString();
	} catch (e) {
		console.error(e);
	}
}

export function setZoomLevel(url?: string, zoom: 0 | 1 | 2 | 3 | 4 | 5 = 0) {
	if (!url) return "";
	try {
		const u = new URL(url);
		u.searchParams.set("zoom", "0");
		console.log({ u });
		return u.toString();
	} catch (e) {
		console.error(e);
	}
}
