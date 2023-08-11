import type { Book } from "$lib/api/gbook";

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


export function get_genre(book: Book) {
	if (!book.volumeInfo?.categories) return;
	if (book.volumeInfo?.categories?.some((c) => c.startsWith("Fiction /"))) {
		return "Fiction";
	} else {
		return "Non-fiction";
	}

}
