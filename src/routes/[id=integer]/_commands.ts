import { goto, invalidate } from '$app/navigation';
import type { Command } from '$lib/components/CommandPalette/types';
import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
import { getTags } from '$lib/data/sync';
import { useCommands } from '$lib/hooks/use-commands';
import { modals } from '$lib/stores/modals';
import { notifications } from '$lib/stores/notifications';
import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
import { archive, patch, post } from '$lib/utils';

export default function useArticleCommands(article: ArticleWithNotesAndTagsAndContext) {
	const articleCommands: Command[] = [
		{
			id: 'archive-article',
			group: 'article',
			name: 'Archive Article',
			icon: 'archive',
			check: () => article.location !== 'ARCHIVE',
			perform: () => {
				// TODO: optimistically update UI
				archive([article.id], '/');
			},
			kbd: [
				['ctrl', 'shift', 'a'],
				['cmd', 'Backspace']
			]
		},
		{
			id: 'delete-article',
			group: 'article',
			name: 'Delete Article',
			icon: 'trash',
			perform: async () => {
				await post('/api/archive_article', {
					id: article.id,
					trash: true
				});
				await invalidate('/');
				goto('/').then(() => {
					notifications.notify({
						type: 'success',
						message: 'Article deleted'
					});
				});
			}
		},
		{
			id: 'move-to-soon',
			group: 'article',
			name: 'Move to Soon',
			check: () => article.location !== 'soon',
			perform: () => {
				fetch(`/${article.id}/__data.json`, {
					method: 'PATCH',
					body: JSON.stringify({ location: 'soon' })
				})
					.then((res) => {
						notifications.notify({
							message: 'Moved to Soon',
							type: 'success'
						});
						return res.json();
					})
					.then((d) => console.log(d));
			},
			icon: 'sparkles'
		},
		{
			id: 'move-to-later',
			group: 'article',
			name: 'Move to Later',
			check: () => article.location !== 'LATER',
			perform: () => patch(`/${article.id}/__data.json`, { location: 'later' }, 'Moved to Later'),
			icon: 'calendar'
		},
		{
			id: 'tag-article',
			group: 'article',
			name: 'Tag Article',
			icon: 'tag',
			perform: async () => {
				modals.open(
					TagInputCombobox,
					{
						articles: [article],
						allTags: await getTags(),
						invalidate: `/${article.id}`
					},
					{
						bgClassname: ''
					}
				);
			}
		},
		{
			id: 're-download-article',
			group: 'article',
			name: 'Re-download Article',
			perform: async () => {
				const form = new FormData();
				form.set('text', article.url);
				const res = await fetch('/add', {
					method: 'POST',
					body: form
				});
				const _article = await res.json();
				console.log({ _article });
				// todo: use zod here
				if (_article) {
					article = _article;
				}
				invalidate(`/${article.id}`);
			},
			icon: 'download'
		},
		{
			id: 'add-note',
			group: 'article',
			name: 'Add note',
			perform: () => goto(`/${article.id}/annotations/new`),
			icon: 'annotation'
		}
	];
	return useCommands(articleCommands);
}
