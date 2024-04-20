import { ArticleSchema } from '../schemas/schemaorg.js';
import type { Document } from '../dom-parser.js';

export function getSchemaOrgArticle(doc: Document) {
	const jsonLd = doc.querySelectorAll('script[type="application/ld+json"]');
	if (!jsonLd) {
		return;
	}
	console.log({ jsonLd });
	const json = [...jsonLd].flatMap((json) => JSON.parse(json.innerHTML));
	console.log({ json });
	if (!json) {
		return;
	}

	const articleJson = json.find((json: any) =>
		new RegExp(['Blog', 'NewsArticle', 'Article'].join('|')).test(
			json['@type'],
		),
	);
	console.log({ articleJson });
	const article = ArticleSchema.safeParse(articleJson);

	if (!article.success) {
		console.log('No article schema', article.error.toString());
		return;
	}

	if (article.data.wordcount) {
		article.data.wordCount = article.data.wordcount;
	}

	return article.data;
}
