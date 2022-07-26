import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
import { derived, writable } from 'svelte/store';

export const notebookArticles = writable<ArticleWithNotesAndTagsAndContext[]>([]);
export const notebookSearch = writable<string>('');

export enum NotebookFilter {
	All = 'All Notes',
	FlaggedNotes = 'Flagged Notes'
}
export const notebookFilter = writable<NotebookFilter>(NotebookFilter.All);

export const filteredNotebookArticles = derived(
	[notebookArticles, notebookSearch, notebookFilter],
	([$notebookArticles, $notebookSearch, $notebookFilter]) => {
		console.log('filtering', $notebookArticles, $notebookSearch, $notebookFilter);
		console.log('filtering', $notebookSearch);
		const accordingtoFilter = (article: ArticleWithNotesAndTagsAndContext) => {
			switch ($notebookFilter) {
				case NotebookFilter.All:
					return true;
				case NotebookFilter.FlaggedNotes:
					return (
						article.highlights.some((note) => note.flagged) ||
						article.annotations.some((note) => note.flagged)
					);
				default:
					return true;
			}
		};
		console.log('hello');
		const filtered = $notebookArticles
			.filter(
				({ title, author, url }) =>
					title.toLowerCase().includes($notebookSearch.toLowerCase()) ||
					author.toLowerCase().includes($notebookSearch.toLowerCase()) ||
					new URL(url).hostname.toLowerCase().includes($notebookSearch.toLowerCase())
			)
			.filter(({ highlights, annotations }) => highlights.length > 0 || annotations.length > 0)
			.filter(accordingtoFilter);
		if ($notebookFilter === NotebookFilter.FlaggedNotes) {
			filtered.forEach((note) => {
				note.highlights = note.highlights.filter(({ flagged }) => flagged);
				note.annotations = note.annotations.filter(({ flagged }) => flagged);
			});
			return filtered;
		}
		return filtered;
		return $notebookArticles;
	}
);
