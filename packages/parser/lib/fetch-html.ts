export async function getHtml(url: string) {
	const response = await fetch(url);
	const text = await response.text();
	return text;
}
