import type { SchemaData } from '../schemas/schemaorg.js';
import {
	ArticleSchema,
	ARTICLE_TYPES,
	BaseSchema,
	CreativeWorkSchema,
	GraphSchema,
	resolveGraph,
} from '../schemas/schemaorg.js';
import type { Document } from '../dom-parser.js';

/**
 * @param doc - Document or Element to parse
 * @returns An array of json parsed  JSON-LD objects. Their contents are not yet validated.
 */
export function extractSchemaOrg(doc: Document): object[] {
	const jsonLd = doc.querySelectorAll('script[type="application/ld+json"]');
	if (!jsonLd) {
		return [];
	}
	const json = [...jsonLd].flatMap((json) => JSON.parse(json.innerHTML));

	return json;
}

function hasTypeProperty(obj: object): obj is {
	'@type': string;
} {
	return '@type' in obj && typeof obj['@type'] === 'string';
}

const articleRegex = new RegExp(ARTICLE_TYPES.join('|'));
const webpageRegex = new RegExp(['WebPage'].join('|'));

export function getSchemaOrgData(doc: Document): SchemaData | undefined {
	const json = extractSchemaOrg(doc);

	const dataGraph: BaseSchema[] = [];

	for (const obj of json) {
		if (
			hasTypeProperty(obj) &&
			(articleRegex.test(obj['@type']) || webpageRegex.test(obj['@type']))
		) {
			// we might not need this extra parsing step, but it adds extra safety
			const parsed = BaseSchema.safeParse(obj);
			if (parsed.success) {
				dataGraph.push(parsed.data);
			}
		} else {
			const graphParsed = GraphSchema.safeParse(obj);
			if (graphParsed.success) {
				dataGraph.push(...(graphParsed.data['@graph'] ?? []));
			}
		}
	}

	const resolved = resolveGraph(dataGraph);

	const articleJson = resolved.find((json) =>
		new RegExp(['Blog', 'NewsArticle', 'Article'].join('|')).test(
			json['@type'],
		),
	);

	const articleParsed = ArticleSchema.safeParse(articleJson);

	const article = articleParsed.success ? articleParsed.data : undefined;
	const webpageJson = resolved.find((json) =>
		new RegExp(['WebPage'].join('|')).test(json['@type']),
	);

	const creativeWorkParsed = CreativeWorkSchema.safeParse(webpageJson);
	const webpage = creativeWorkParsed.success
		? creativeWorkParsed.data
		: undefined;

	if (article?.wordcount) {
		article.wordCount = article.wordcount;
	}

	return article ?? webpage;
}
