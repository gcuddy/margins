import { goto } from '$app/navigation';
import type { Command } from '$lib/components/CommandPalette/types';
import { modals } from '$lib/stores/modals';
import URLModal from '$lib/components/modals/URLModal.svelte';
// import { getDirectory } from '$lib/file-access';
import { darkMode } from '$lib/stores/settings';
import TextareaSvelte from '$lib/components/Textarea.svelte';
import BulkURLs from '$lib/components/BulkURLs.svelte';
import { commandPaletteStore } from '$lib/components/CommandPalette/store';
import { showCommandPalette } from '$lib/stores/commands';
import { cachedArticlesArray } from '$lib/stores/cache';
import type { Article, Tag } from '@prisma/client';
import CircularProgressBarSvelte from '$lib/components/CircularProgressBar/CircularProgressBar.svelte';
import { getArticles, getTags, tagsStore } from './sync';
import Icon from '$lib/components/helpers/Icon.svelte';

export const jumpToArticle = () => {
	getArticles();
	commandPaletteStore.open({
		values: cachedArticlesArray,
		onSelect: ({ detail: article }) => {
			goto(`/${article.id}`);
		},
		// totally gratuitious progress bar
		itemIcon: (val: Article) => {
			return {
				component: CircularProgressBarSvelte,
				props: {
					value: val.readProgress,
					minValue: 0,
					maxValue: 1,
					className: 'h-4 w-4 flex-none shrink-0 basis-5',
					trailClass: 'stroke-gray-400',
					pathClass: 'stroke-red-400'
				}
			};
		},
		itemDisplay: (val: Article) => {
			return `<div class="flex"><span class="font-medium">${val.title}</span> <span class="text-sm">${val.author}</span></div>`;
		}
	});
};

export const jumpToTag = () => {
	getTags();
	commandPaletteStore.open({
		values: tagsStore,
		onSelect: ({ detail: tag }) => {
			goto(`/tags/${tag.name}`);
		},
		itemIcon: () => {
			return {
				component: Icon,
				props: {
					name: 'tag'
				}
			};
		},
		prefetch: (val: Tag) => {
			return `/tags/${val.name}`;
		}
	});
};

export const commands: Command[] = [
	{
		id: 'go-home',
		group: 'default',
		name: 'Home',
		perform: () => goto('/'),
		icon: 'home',
		kbd: [
			['g', 'h'],
			['cmd', 'e']
		]
	},
	{
		id: 'go-notebook',
		group: 'default',
		name: 'Notebook',
		perform: () => goto('/notebook'),
		icon: 'bookmarkAlt'
	},
	{
		id: 'add-url',
		group: 'default',
		name: 'Add URL',
		perform: () => {
			console.log('[command] adding url');
			modals.open(URLModal);
		},
		icon: 'plusCircle',
		kbd: [['a']]
	},
	{
		id: 'add-bookmark',
		group: 'default',
		name: 'Add Bookmark from URL',
		perform: () =>
			modals.open(URLModal, {
				formAction: '/api/bookmarks'
			}),
		icon: `plusCircle`
	},
	{
		id: 'go-rss',
		group: 'default',
		name: 'RSS',
		perform: () => goto('/rss'),
		icon: 'rss',
		kbd: [['g', 'r']]
	},
	{
		id: 'add-directory',
		group: 'default',
		name: 'Add Directory of PDF Files',
		perform: async () => {
			// await getDirectory();
		},
		icon: 'folderAdd'
	},
	{
		id: 'toggle-dark-mode',
		group: 'default',
		name: 'Toggle Light/Dark mode',
		perform: () => darkMode.update((d) => !d),
		icon: 'lightBulb'
	},
	{
		id: 'export',
		group: 'default',
		name: 'Export Data',
		perform: () => {
			fetch('/__data.json', {
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => res.json())
				.then((data) => {
					const urls = data.articles.map((a) => a.url);
					modals.open(TextareaSvelte, {
						value: urls.join('\n'),
						rows: Math.min(10, urls.length)
					});
				});
		},
		icon: 'save'
	},
	{
		id: 'add-list-of-urls',
		group: 'default',
		name: 'Add list of urls',
		perform: () => modals.open(BulkURLs),
		icon: 'plusCircle'
	},
	{
		id: 'jump-to-article',
		group: 'jump',
		name: 'Jump to article',
		perform: () => {
			showCommandPalette.out();
			jumpToArticle();
		},
		icon: 'arrowRight',
		kbd: [['o', 'a']]
	},
	{
		id: 'jump-to-tag',
		group: 'jump',
		name: 'Jump to Tag',
		perform: () => {
			showCommandPalette.out();
			jumpToTag();
		},
		icon: 'arrowRight',
		kbd: [['o', 't']]
	},
	{
		id: 'go-to-search',
		group: 'Navigation',
		name: 'Go to Search',
		perform: () => {
			goto('/search');
		},
		icon: 'search'
	},
	{
		id: 'new-smart-list',
		group: 'Lists',
		name: 'Create new smart list',
		perform: () => {
			goto('/smart/new');
		},
		icon: 'plus'
	}
];
