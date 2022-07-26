import type { ArticleWithNotesAndTags } from '$lib/types';
import { writable } from 'svelte/store';

export const allArticles = writable<ArticleWithNotesAndTags[]>([]);
