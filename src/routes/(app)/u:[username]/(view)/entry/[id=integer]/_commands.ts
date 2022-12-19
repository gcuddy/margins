import type { Annotation } from '@prisma/client';

import { goto, invalidate } from '$app/navigation';
import type { Command } from '$lib/components/CommandPalette/types';
import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
import { getTags } from '$lib/data/sync';
import type { EntryWithAnnotations } from '$lib/entry.server';
import { useCommands } from '$lib/hooks/use-commands';
import { modals } from '$lib/stores/modals';
import { notifications } from '$lib/stores/notifications';
import { syncStore } from '$lib/stores/sync';
import type { RootUserData } from '$lib/user';
import { patch, post } from '$lib/utils';

export default function useArticleCommands(entry: EntryWithAnnotations, user: RootUserData) {
	const bookmark = entry.annotations.find((a) => a.type === 'bookmark');
	if (!bookmark) {
		console.warn('No bookmark annotation found');
	}
	const articleCommands: Command[] = [
		{
			id: 'archive-article',
			group: 'article',
			name: 'Archive Article',
			icon: 'archive',
			check: () => !!bookmark && bookmark?.state?.type !== 'archive',
			perform: async () => {
				// TODO: optimistically update UI
				// find archive location
				const stateId = [...user.states]
					.sort((a, b) => a.position - b.position)
					.find((state) => state.type === 'archive')?.id;
				if (!stateId) {
					// TODO: what to do here? we shouldn't ever be here right? we should create the default archive state
					console.error('No state for archiving!');
					return;
				}
				const res = await fetch(`/api/annotations/${(bookmark as Annotation).id}`, {
					method: 'PATCH',
					body: JSON.stringify({
						stateId,
					}),
				});
				if (res.ok) {
					notifications.notify({
						title: 'Archived article',
						type: 'success',
					});
					const bookmark = await res.json();
					console.log({ bookmark });
				}
				// archive([entry.id], '/');
			},
			kbd: [
				['ctrl', 'shift', 'a'],
				['cmd', 'Backspace'],
			],
		},
		{
			id: 'delete-article',
			group: 'article',
			name: 'Delete Article',
			icon: 'trash',
			perform: async () => {
				await post('/api/archive_article', {
					id: entry.id,
					trash: true,
				});
				await invalidate('/');
				goto('/').then(() => {
					notifications.notify({
						type: 'success',
						message: 'Article deleted',
					});
				});
			},
		},
		{
			id: 'move-to-soon',
			group: 'article',
			name: 'Move to Soon',
			check: () => entry.location !== 'soon',
			perform: () => {
				fetch(`/${entry.id}/__data.json`, {
					method: 'PATCH',
					body: JSON.stringify({ location: 'SOON' }),
				})
					.then((res) => {
						notifications.notify({
							message: 'Moved to Soon',
							type: 'success',
						});
						return res.json();
					})
					.then((d) => console.log(d));
			},
			icon: 'sparkles',
		},
		{
			id: 'move-to-later',
			group: 'article',
			name: 'Move to Later',
			check: () => entry.location !== 'LATER',
			perform: () => patch(`/${entry.id}/__data.json`, { location: 'later' }, 'Moved to Later'),
			icon: 'calendar',
		},
		{
			id: 'tag-article',
			group: 'article',
			name: 'Tag Article',
			icon: 'tag',
			perform: async () => {
				modals.open(TagInputCombobox, {
					articles: [entry],
					allTags: await getTags(),
					invalidate: `/${entry.id}`,
				});
			},
		},
		{
			id: 're-download-article',
			group: 'article',
			name: 'Re-download Article',
			perform: async () => {
				const syncId = syncStore.addItem();
				const id = notifications.notify({
					title: 'Re-downloading article',
					message: "This shouldn't take long",
					timeout: 3000,
				});
				const form = new FormData();
				form.set('text', entry.url);
				const res = await fetch('/add', {
					method: 'POST',
					body: form,
					headers: {
						accept: 'application/json',
					},
				});
				{
					//done
					syncStore.removeItem(syncId);
					notifications.notify({
						title: 'Successfully re-downloaded article',
						message: 'Article has been re-downloaded. Refresh the page to see it.',
						type: 'success',
					});
				}
				const _article = await res.json();
				console.log({ _article });
				// todo: use zod here
				await invalidate(`/${entry.id}`);
			},
			icon: 'download',
		},
		{
			id: 'add-note',
			group: 'article',
			name: 'Add note',
			perform: () => goto(`/${entry.id}/annotations/new`),
			icon: 'annotation',
		},
	];
	return useCommands(articleCommands);
}
