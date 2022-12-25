<script lang="ts">
	import { notifications } from '$lib/stores/notifications';

	import { syncStore } from '$lib/stores/sync';

	import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
	import { TargetSchema, TextQuoteTarget } from '$lib/types/schemas/Annotations';
	import { bulkEditArticles, postAnnotation } from '$lib/utils';
	import type { Tag } from '@prisma/client';
	import { slide } from 'svelte/transition';
	import { tick } from 'svelte';
	import GenericTextarea from '$lib/components/GenericTextarea.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import TagCloud from '$lib/components/TagCloud.svelte';
	import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
	import type { Metadata } from './types';
	import type { ExtendedAnnotation } from '$lib/annotation';
	import type { ExtendedBookmark } from '$lib/bookmark';
	import type { EntryWithBookmark } from '$lib/entry.server';
	export let entry: EntryWithBookmark;
	export let bookmark: ExtendedBookmark | undefined = undefined;
	export let active: boolean;
	// export let menu_active = false;

	$: pageNotes = entry?.annotations?.filter((a) => a.type === 'note');
	$: inlineNotes = entry?.annotations?.filter((a) => a.type === 'annotation');

	let tags: Tag[] = [];
	$: console.log({ tags });
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			active = false;
		}
	}}
/>

<!-- mt-8 to account for reading menu -->
<aside
	class="fixed top-0 bottom-0 right-0 z-10 mt-8 flex h-full w-full transform-gpu flex-col space-y-5 overflow-auto border border-gray-200 bg-gray-50 p-4 backdrop-blur-md  transition ease-in-out dark:border-gray-700 dark:bg-transparent dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90 dark:shadow-stone-900 sm:w-96 {active
		? 'translate-x-0 shadow-2xl'
		: 'translate-x-full'}"
>
	<div class="flex flex-col space-y-2">
		<span class="text-lg font-semibold">{entry.title}</span>
		<span class="text-base font-medium">{entry.author}</span>
		<!-- {article.starred} -->
		<!-- {article.public} -->
		<!-- <select
			name="public"
			id="public-select"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
			bind:value={article.public}
			on:change={async (e) => {
				await tick();
				const id = syncStore.addItem();
				console.log(article.public);
				await bulkEditArticles([article.id], {
					public: article.public,
				});
				syncStore.removeItem(id);
			}}
		>
			<option value={true}>Public</option>
			<option value={false}>Private</option>
		</select> -->
		<!-- <select
			name=""
			id=""
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
			bind:value={article.location}
			on:change={async (e) => {
				await tick();
				const id = syncStore.addItem();
				bulkEditArticles([article.id], {
					location: article.location,
				});
				syncStore.removeItem(id);
			}}
		>
			<option value="INBOX">Inbox</option>
			<option value="SOON">Soon</option>
			<option value="LATER">Later</option>
			<option value="ARCHIVE">Archive</option>
		</select> -->
		{#if entry.tags}
			<div transition:slide|local>
				<TagInputCombobox bind:tags={entry.tags} original={{ ...entry }} />
			</div>
		{/if}
		{#if entry.context}
			{JSON.stringify(entry.context)}
		{/if}
		<!-- <GenericTextarea
			variant="ghost"
			bind:value
			placeholder="Notes"
			on:blur={async () => {
				if (!value && !note) {
					// we'll be here when there was no content, and there still is
					// early return to avoid creating a note with no content
					return;
				}
				if (!value && note) {
					// we'll be here when there was no content, and there is a note
					// delete the note
					const id = syncStore.addItem();
					const res = await fetch(`/annotations/${note.id}`, {
						method: 'DELETE',
					});
					syncStore.removeItem(id);
					if (!res.ok) {
						notifications.notify({
							message: 'Could not delete note',
							type: 'error',
						});
					} else {
						notifications.notify({
							message: 'Note deleted',
							type: 'success',
						});
					}
					return;
				}
				if (value === note?.body) {
					// return if no change
					return;
				}
				const res = await postAnnotation({
					articleId: article.id,
					target: {
						source: article.url,
					},
					motivation: 'describing',
					body: value,
					id: note?.id,
				});
				console.log({ json: await res.json() });
				if (!res.ok) {
					notifications.notify({
						title: 'Error saving note',
						message: res.statusText,
						type: 'error',
					});
				} else {
					notifications.notify({
						title: 'Note saved',
						message: '',
						type: 'success',
					});
				}
			}}
		/> -->
	</div>
	{#if inlineNotes?.length}
		<div class="pt-2 pb-4">
			<span class="font-medium">Annotations ({inlineNotes.length})</span>
			<div class="flex flex-col space-y-4  text-sm">
				{#each inlineNotes as annotation}
					{@const target = TextQuoteTarget.parse(annotation.target)}
					<a
						href="#annotation-{annotation.id}"
						class="flex flex-col space-y-2 border-b border-gray-300 py-4"
						on:click={() => (active = false)}
					>
						<div class="border-l border-amber-200 px-3">{target.selector.exact}</div>
						{#if annotation.body}
							<span class="max-w-max rounded-full border border-lime-400 py-2 px-3"
								>{annotation.body}</span
							>
						{/if}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</aside>
