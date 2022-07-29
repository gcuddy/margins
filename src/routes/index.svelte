<script lang="ts" context="module">
	// todo: pass data into stuff
</script>

<script lang="ts">
	import Saved from '$lib/components/Saved.svelte';
	import type { Article, Tag } from '@prisma/client';
	import { modals } from '$lib/stores/modals';
	import { allArticles } from '$lib/stores/articles';
	import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
	import type { Link } from '$lib/components/Sidebar.svelte';
	import { cachedArticlesStore } from '$lib/stores/cache';
	import Header from '$lib/components/layout/Header.svelte';
	import { headerComponent } from '$lib/stores/header';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import LocationSelect from '$lib/components/layout/headers/LocationSelect.svelte';
	export let articles: ArticleWithNotesAndTagsAndContext[];
	cachedArticlesStore.set({
		articles,
		lastUpdate: new Date()
	});
	export let tags: Tag[] = [];
	console.log({ tags });
	allArticles.set(articles);
	$: console.log({ modals: $modals });

	const sidebarLinks: Link[][] = [
		[
			{
				text: 'All',
				href: '/',
				id: 'all',
				icon: 'home'
			},
			{
				text: 'Inbox',
				href: '/saved/inbox',
				id: 'inbox',
				icon: 'inbox'
			},
			{
				text: 'Soon',
				href: '/saved/soon',
				id: 'soon',
				icon: 'clock'
			},
			{
				text: 'Later',
				href: '/saved/later',
				id: 'later',
				icon: 'calendar'
			}
		],
		[
			{
				text: 'Tags',
				id: 'tags',
				visible: true,
				children: tags.map((tag) => ({
					text: tag?.name,
					href: `/tags/${tag?.name}`,
					id: tag?.name
				}))
			}
		]
	];

	$: console.log({ allArticles: $allArticles });

	headerComponent.update((h) => ({
		props: {},
		header: {
			component: DefaultHeader,
			slots: {
				start: {
					component: LocationSelect
				}
			}
		}
	}));
</script>

<svelte:head><title>Margins</title></svelte:head>

<Header>
	<DefaultHeader>
		<div slot="start">
			<select name="" id="">
				<option>Inbox</option>
				<option>Up Next</option>
				<option>Later</option>
				<option>Archive</option>
			</select>
		</div>
	</DefaultHeader>
</Header>

<div class="flex h-full flex-auto flex-col overflow-hidden">
	<!-- todo; overflow-auto and get scrolling to work only WITHIN this container... -->
	<div class="relative overflow-auto">
		<Saved {articles} />
	</div>
</div>
