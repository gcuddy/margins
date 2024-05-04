import { GraphSchema, WebPageSchema, resolveGraph } from './schemaorg.js';

describe('Suite of tests for Schema.org structurued data', () => {
	test.todo('Schema org parsing');
});

describe('Schema.org @graph', () => {
	const schema = [
		{
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@id': 'https://www.noemamag.com/we-need-to-rewild-the-internet/',
					'@type': 'WebPage',
					breadcrumb: {
						'@id':
							'https://www.noemamag.com/we-need-to-rewild-the-internet/#breadcrumb',
					},
					dateModified: '2024-04-19T09:09:50+00:00',
					datePublished: '2024-04-16T17:00:45+00:00',
					description:
						'The internet has become an extractive and fragile monoculture. But we can revitalize it using lessons learned by ecologists.',
					image: {
						'@id':
							'https://www.noemamag.com/we-need-to-rewild-the-internet/#primaryimage',
					},
					inLanguage: 'en-US',
					isPartOf: {
						'@id': 'https://www.noemamag.com/#website',
					},
					name: 'We Need To Rewild The Internet',
					potentialAction: [
						{
							'@type': 'ReadAction',
							target: [
								'https://www.noemamag.com/we-need-to-rewild-the-internet/',
							],
						},
					],
					primaryImageOfPage: {
						'@id':
							'https://www.noemamag.com/we-need-to-rewild-the-internet/#primaryimage',
					},
					thumbnailUrl:
						'https://noemamag.imgix.net/2024/04/noema_pillar_growth_004.jpg?fm=pjpg&ixlib=php-3.3.1&s=0f85f0ffb51e8b43eef46161b6dbefea',
					url: 'https://www.noemamag.com/we-need-to-rewild-the-internet/',
				},
				{
					'@id':
						'https://www.noemamag.com/we-need-to-rewild-the-internet/#primaryimage',
					'@type': 'ImageObject',
					caption: 'Noah Campeau for Noema Magazine',
					contentUrl:
						'https://noemamag.imgix.net/2024/04/noema_pillar_growth_004.jpg?fm=pjpg&ixlib=php-3.3.1&s=0f85f0ffb51e8b43eef46161b6dbefea',
					height: 1186,
					inLanguage: 'en-US',
					url: 'https://noemamag.imgix.net/2024/04/noema_pillar_growth_004.jpg?fm=pjpg&ixlib=php-3.3.1&s=0f85f0ffb51e8b43eef46161b6dbefea',
					width: 947,
				},
				{
					'@id':
						'https://www.noemamag.com/we-need-to-rewild-the-internet/#breadcrumb',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							item: 'https://www.noemamag.com/',
							name: 'Home',
							position: 1,
						},
						{
							'@type': 'ListItem',
							name: 'We Need To Rewild The Internet ',
							position: 2,
						},
					],
				},
				{
					'@id': 'https://www.noemamag.com/#website',
					'@type': 'WebSite',
					description: 'Noema Magazine',
					inLanguage: 'en-US',
					name: 'NOEMA',
					potentialAction: [
						{
							'@type': 'SearchAction',
							'query-input': 'required name=search_term_string',
							target: {
								'@type': 'EntryPoint',
								urlTemplate: 'https://www.noemamag.com/?s={search_term_string}',
							},
						},
					],
					publisher: {
						'@id': 'https://www.noemamag.com/#organization',
					},
					url: 'https://www.noemamag.com/',
				},
				{
					'@id': 'https://www.noemamag.com/#organization',
					'@type': 'Organization',
					image: {
						'@id': 'https://www.noemamag.com/#/schema/logo/image/',
					},
					logo: {
						'@id': 'https://www.noemamag.com/#/schema/logo/image/',
						'@type': 'ImageObject',
						caption: 'NOEMA',
						contentUrl:
							'https://noemamag.imgix.net/2023/11/noema-logo.png?fm=png&ixlib=php-3.3.1&s=5f5be9b261a7cf7e336f6f6beea6e539',
						height: 69,
						inLanguage: 'en-US',
						url: 'https://noemamag.imgix.net/2023/11/noema-logo.png?fm=png&ixlib=php-3.3.1&s=5f5be9b261a7cf7e336f6f6beea6e539',
						width: 305,
					},
					name: 'NOEMA',
					sameAs: [
						'https://www.facebook.com/NoemaMag',
						'https://twitter.com/NoemaMag',
					],
					url: 'https://www.noemamag.com/',
				},
			],
		},
	];
	test('Resolve @graph', () => {
		const graphs = schema
			.map((s) => {
				const parsed = GraphSchema.safeParse(s);
				if (parsed.success) {
					return parsed.data;
				}
			})
			.filter(Boolean);
		const graph = graphs.find(Boolean)!;
		const resolved = resolveGraph(graph['@graph'] ?? []);

		const parsedWebpage = resolved
			.filter((item) => item?.['@type'] === 'WebPage')
			.map((item) => WebPageSchema.parse(item))
			.at(0);

		expect(parsedWebpage).toBeTruthy();
		if (!parsedWebpage) {
			return;
		}

		expect(parsedWebpage?.url).toBe(
			'https://www.noemamag.com/we-need-to-rewild-the-internet/',
		);

		const { image } = parsedWebpage;

		expect(
			typeof image === 'object' &&
				image.url ===
					'https://noemamag.imgix.net/2024/04/noema_pillar_growth_004.jpg?fm=pjpg&ixlib=php-3.3.1&s=0f85f0ffb51e8b43eef46161b6dbefea',
		).toBeTruthy();

		console.log(parsedWebpage);

		expect(parsedWebpage.datePublished.toISOString()).toBe(
			'2024-04-16T17:00:45.000Z',
		);

		expect(parsedWebpage).toMatchObject({
			description:
				'The internet has become an extractive and fragile monoculture. But we can revitalize it using lessons learned by ecologists.',
			image: {
				url: 'https://noemamag.imgix.net/2024/04/noema_pillar_growth_004.jpg?fm=pjpg&ixlib=php-3.3.1&s=0f85f0ffb51e8b43eef46161b6dbefea',
			},
			name: 'We Need To Rewild The Internet',
			url: 'https://www.noemamag.com/we-need-to-rewild-the-internet/',
		});
	});
});
