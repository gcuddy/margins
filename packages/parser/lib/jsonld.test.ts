import { parse } from 'node-html-parser';
import { getSchemaOrgData } from './jsonld.js';

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
		const article = getSchemaOrgData(doc);

		expect(article).toMatchObject({
			'@context': 'https://schema.org',
			'@type': 'Article',
			name: 'Pankaj Mishra · The Shoah after Gaza',
		});
	});
});

const nytimesHtml = `
<html>
<head>
    <meta data-rh="true" name="robots" content="noarchive, max-image-preview:large"/><meta data-rh="true" name="description" content="Israeli officials say they didn’t see a strike on a high-level Iranian target in Syria as a provocation, and did not give Washington a heads-up about it until right before it happened."/><meta data-rh="true" property="og:url" content="https://www.nytimes.com/2024/04/17/world/middleeast/iran-israel-attack.html"/><meta data-rh="true" property="og:type" content="article"/><meta data-rh="true" property="og:title" content="Miscalculation Led to Escalation in Clash Between Israel and Iran"/><meta data-rh="true" property="og:image" content="https://static01.nyt.com/images/2024/04/17/multimedia/17middle-east-ticktock-1-mfjw/17middle-east-ticktock-1-mfjw-facebookJumbo.jpg"/><meta data-rh="true" property="og:image:alt" content="The Iranian Embassy complex in Damascus, Syria, a day after an airstrike by Israel."/><meta data-rh="true" property="og:description" content="Israeli officials say they didn’t see a strike on a high-level Iranian target in Syria as a provocation, and did not give Washington a heads-up about it until right before it happened."/><meta data-rh="true" property="twitter:url" content="https://www.nytimes.com/2024/04/17/world/middleeast/iran-israel-attack.html"/><meta data-rh="true" property="twitter:title" content="Miscalculation Led to Escalation in Clash Between Israel and Iran"/><meta data-rh="true" property="twitter:description" content="Israeli officials say they didn’t see a strike on a high-level Iranian target in Syria as a provocation, and did not give Washington a heads-up about it until right before it happened."/><meta data-rh="true" property="twitter:image" content="https://static01.nyt.com/images/2024/04/17/multimedia/17middle-east-ticktock-1-mfjw/17middle-east-ticktock-1-mfjw-videoSixteenByNine3000.jpg"/><meta data-rh="true" property="twitter:image:alt" content="The Iranian Embassy complex in Damascus, Syria, a day after an airstrike by Israel."/><meta data-rh="true" property="twitter:card" content="summary_large_image"/> <link data-rh="true" rel="canonical" href="https://www.nytimes.com/2024/04/17/world/middleeast/iran-israel-attack.html"/><link data-rh="true" rel="alternate" href="nyt://article/96ddb636-0700-56df-988b-357d10462235"/><link data-rh="true" rel="alternate" type="application/json+oembed" href="https://www.nytimes.com/svc/oembed/json/?url=https%3A%2F%2Fwww.nytimes.com%2F2024%2F04%2F17%2Fworld%2Fmiddleeast%2Firan-israel-attack.html" title="Miscalculation Led to Escalation in Clash Between Israel and Iran"/> <script data-rh="true" type="application/ld+json">{"@context":"https://schema.org","@type":"NewsArticle","description":"Israeli officials say they didn’t see a strike on a high-level Iranian target in Syria as a provocation, and did not give Washington a heads-up about it until right before it happened.","image":[{"@context":"https://schema.org","@type":"ImageObject","url":"https://static01.nyt.com/images/2024/04/17/multimedia/17middle-east-ticktock-1-mfjw/17middle-east-ticktock-1-mfjw-videoSixteenByNineJumbo1600.jpg","height":900,"width":1600,"contentUrl":"https://static01.nyt.com/images/2024/04/17/multimedia/17middle-east-ticktock-1-mfjw/17middle-east-ticktock-1-mfjw-videoSixteenByNineJumbo1600.jpg","caption":"The Iranian Embassy complex in Damascus, Syria, a day after an airstrike by Israel.","creditText":"Louai Beshara/Agence France-Presse — Getty Images"},{"@context":"https://schema.org","@type":"ImageObject","url":"https://static01.nyt.com/images/2024/04/17/multimedia/17middle-east-ticktock-1-mfjw/17middle-east-ticktock-1-mfjw-googleFourByThree.jpg","height":600,"width":800,"contentUrl":"https://static01.nyt.com/images/2024/04/17/multimedia/17middle-east-ticktock-1-mfjw/17middle-east-ticktock-1-mfjw-googleFourByThree.jpg","caption":"The Iranian Embassy complex in Damascus, Syria, a day after an airstrike by Israel.","creditText":"Louai Beshara/Agence France-Presse — Getty Images"},{"@context":"https://schema.org","@type":"ImageObject","url":"https://static01.nyt.com/images/2024/04/17/multimedia/17middle-east-ticktock-1-mfjw/17middle-east-ticktock-1-mfjw-mediumSquareAt3X.jpg","height":1800,"width":1800,"contentUrl":"https://static01.nyt.com/images/2024/04/17/multimedia/17middle-east-ticktock-1-mfjw/17middle-east-ticktock-1-mfjw-mediumSquareAt3X.jpg","caption":"The Iranian Embassy complex in Damascus, Syria, a day after an airstrike by Israel.","creditText":"Louai Beshara/Agence France-Presse — Getty Images"}],"mainEntityOfPage":"https://www.nytimes.com/2024/04/17/world/middleeast/iran-israel-attack.html","url":"https://www.nytimes.com/2024/04/17/world/middleeast/iran-israel-attack.html","inLanguage":"en","author":[{"@context":"https://schema.org","@type":"Person","url":"https://www.nytimes.com/by/ronen-bergman","name":"Ronen Bergman"},{"@context":"https://schema.org","@type":"Person","url":"https://www.nytimes.com/by/farnaz-fassihi","name":"Farnaz Fassihi"},{"@context":"https://schema.org","@type":"Person","url":"https://www.nytimes.com/by/eric-schmitt","name":"Eric Schmitt"},{"@context":"https://schema.org","@type":"Person","url":"https://www.nytimes.com/by/adam-entous","name":"Adam Entous"},{"@context":"https://schema.org","@type":"Person","url":"https://www.nytimes.com/by/richard-perez-pena","name":"Richard Pérez-Peña"}],"dateModified":"2024-04-18T02:50:16.000Z","datePublished":"2024-04-17T22:08:46.000Z","headline":"Miscalculation Led to Escalation in Clash Between Israel and Iran","alternativeHeadline":"How Israel Miscalculation Poked at a Hornet’s Nest","publisher":{"@id":"https://www.nytimes.com/#publisher","name":"The New York Times"},"hasPart":{"@type":"WebPageElement","isAccessibleForFree":false,"cssSelector":".meteredContent"},"copyrightHolder":{"@id":"https://www.nytimes.com/#publisher","name":"The New York Times"},"sourceOrganization":{"@id":"https://www.nytimes.com/#publisher","name":"The New York Times"},"copyrightYear":2024,"isAccessibleForFree":false,"isPartOf":{"@type":["CreativeWork","Product"],"name":"The New York Times","productID":"nytimes.com:basic"}}</script><script data-rh="true" type="application/ld+json">{"@context":"https://schema.org","@type":"NewsMediaOrganization","name":"The New York Times","logo":{"@context":"https://schema.org","@type":"ImageObject","url":"https://static01.nyt.com/images/icons/t_logo_291_black.png","height":291,"width":291,"contentUrl":"https://static01.nyt.com/images/icons/t_logo_291_black.png","creditText":"The New York Times"},"url":"https://www.nytimes.com/","@id":"https://www.nytimes.com/#publisher","diversityPolicy":"https://www.nytco.com/company/diversity-and-inclusion/","ethicsPolicy":"https://www.nytco.com/company/standards-ethics/","masthead":"https://www.nytimes.com/interactive/2023/01/28/admin/the-new-york-times-masthead.html","foundingDate":"1851-09-18","sameAs":"https://en.wikipedia.org/wiki/The_New_York_Times"}</script><script data-rh="true" type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@context":"https://schema.org","@type":"ListItem","name":"World","position":1,"item":"https://www.nytimes.com/section/world"},{"@context":"https://schema.org","@type":"ListItem","name":"Middle East","position":2,"item":"https://www.nytimes.com/section/world/middleeast"}]}</script>
</head>
</html>
`;

describe('nytimes-jsonld', () => {
	const doc = parse(nytimesHtml);
	test('should parse jsonld schema.org article for nytimes', () => {
		const article = getSchemaOrgData(doc);
		expect(article).toMatchObject({
			'@context': 'https://schema.org',
			'@type': 'NewsArticle',
			headline:
				'Miscalculation Led to Escalation in Clash Between Israel and Iran',
		});
	});
});
