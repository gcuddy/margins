import { ArticleSchema } from '../schemas/schemaorg.js';
import type { HTMLElement } from 'node-html-parser';

export function getSchemaOrgArticle(doc: HTMLElement) {
	const jsonLd = doc.querySelectorAll('script[type="application/ld+json"]');
	if (!jsonLd) {
		return;
	}
	const json = Array.from(jsonLd).flatMap((json) => JSON.parse(json.innerHTML));
	if (!json) {
		return;
	}
	const articleJson = json.find((json: any) =>
		new RegExp(['Blog', 'NewsArticle', 'Article'].join('|')).test(
			json['@type'],
		),
	);
	const article = ArticleSchema.safeParse(articleJson);

	if (!article.success) {
		return;
	}

	if (article.data.wordcount) {
		article.data.wordCount = article.data.wordcount;
	}

	return article.data;
}
