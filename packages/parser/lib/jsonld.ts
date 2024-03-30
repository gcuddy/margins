export function getJsonLd(doc: HTMLElement) {
	const jsonLd = doc.querySelectorAll('script[type="application/ld+json"]');
	if (!jsonLd) {
		return;
	}
	const json = Array.from(jsonLd).flatMap((json) => JSON.parse(json.innerHTML));
	if (!json) {
		return;
	}
	const articleJson = json.find((json: any) =>
		new RegExp(['Article', 'Blog', 'NewsArticle'].join('|')).test(
			json['@type'],
		),
	);
	return articleJson;
}
