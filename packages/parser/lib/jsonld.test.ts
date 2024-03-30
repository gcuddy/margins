import { parse } from 'node-html-parser';
import { getSchemaOrgArticle } from './jsonld.js';

const html = `
<!DOCTYPE html>
<html>
<head>
<script data-schema="Article" type="application/ld+json">{
    "@context": "https://schema.org",
    "@type": "Article",
    "name": "Pankaj Mishra · The Shoah after Gaza",
    "headline": "Pankaj Mishra · The Shoah after Gaza",
            "image": "https://www.lrb.co.uk/storage/social_image_on_bg/images/6/0/8/2/30072806-1-eng-GB/962c8f7c0a08-fccfb42c01764b7d49750e0d348ad716.jpg",
                    "author": "Pankaj Mishra",
                    "keywords": "",
            "wordcount": "7503",
            "publisher": {
"@type": "Organization",
"name":"London Review of Books",
"logo": {
    "@type": "ImageObject",
    "url":"https://lrb.co.uk/assets/icons/apple-touch-icon.png",
    "width":180,
    "height":180
}
}
,
    "url": "https://www.lrb.co.uk/the-paper/v46/n06/pankaj-mishra/the-shoah-after-gaza",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://google.com/article"
    },
    "datePublished": "2024-03-01T15:00:00+00:00",
    "dateCreated": "2024-03-01T15:00:00+00:00",
    "dateModified": "2024-03-13T15:34:02+00:00",
    "description": "Memories of Jewish suffering at the hands of Nazis are the foundation on which most descriptions of extreme ideology and...",
    "inLanguage": "en",
    "isAccessibleForFree": false,
  "hasPart": {
    "@type": "WebPageElement",
    "isAccessibleForFree": "False",
    "cssSelector": ".article-content"
  }
}</script>

</head>
</html>
`;

describe('jsonld', () => {
	const doc = parse(html);
	test('should parse jsonld schema.org article', () => {
		const article = getSchemaOrgArticle(doc);

		expect(article).toMatchObject({
			'@context': 'https://schema.org',
			'@type': 'Article',
			name: 'Pankaj Mishra · The Shoah after Gaza',
		});
	});
});
