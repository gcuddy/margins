<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ExtendedBookmark } from '$lib/bookmark';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import GenericTextarea from '$lib/components/GenericTextarea.svelte';
	import StateCombobox from '$lib/components/StateCombobox.svelte';
	import StateListbox from '$lib/components/StateListbox.svelte';
	import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
	import type { EntryWithBookmark } from '$lib/entry.server';
	import { syncStore } from '$lib/stores/sync';
	import { trpc } from '$lib/trpc/client';
	import { TextQuoteTarget } from '$lib/types/schemas/Annotations';
	import type { Tag } from '@prisma/client';
	import { tweened } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	export let entry: EntryWithBookmark;
	export let bookmark: ExtendedBookmark | undefined = undefined;
	export let active: boolean;
	// export let menu_active = false;

	function customBackOut(t: number) {
		const s = 0.7;
		return --t * t * ((s + 1) * t + s) + 1;
	}
	$: pageNotes = entry?.annotations?.filter((a) => a.type === 'note');
	$: inlineNotes = entry?.annotations?.filter((a) => a.type === 'annotation');

	let tags: Tag[] = [];
	$: console.log({ tags });

	let WIDTH = 400;

	let WIDTH_SPRING = tweened(WIDTH, {
		duration: 400,
		easing: customBackOut,
		delay: 0,
	});

	let display = active;

	$: if (active) {
		display = active;
		WIDTH_SPRING.set(0);
	} else {
		WIDTH_SPRING.set(WIDTH).then(() => (display = active));
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			active = false;
		}
	}}
/>

<!-- mt-8 to account for reading menu -->
{#if display}
	<aside
		style:margin-left="{$WIDTH_SPRING * -1}px"
		style:width="{WIDTH}px"
		style:transform="translateX({$WIDTH_SPRING}px)"
		class="z-10 mt-14 flex max-h-full flex-col space-y-5 overflow-auto overflow-y-auto border border-gray-200 bg-gray-50 p-4 shadow-lg backdrop-blur-md transition-shadow dark:border-gray-700 dark:bg-transparent dark:bg-gradient-to-br  dark:from-gray-800/90 dark:to-gray-900/90 dark:shadow-stone-900 max-md:absolute max-md:top-0 max-md:right-0 max-md:bottom-0 sm:w-96 md:relative"
	>
		<!-- <div class="absolute top-0 left-0 h-full w-full bg-red-500" style:width="450px" /> -->

		<div class="flex flex-col space-y-2">
			<span class="text-lg font-semibold">{entry.title}</span>
			<span class="text-base font-medium">{entry.author}</span>
			{#if entry.type === 'rss' || entry.feedId}
				<!-- display feed -->
				<!-- Or just put this in context section -->
				subscription: {$page.data.subscriptions?.find((s) => s.feedId === entry.feedId)?.title}
			{/if}

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
			{#if entry.bookmark?.stateId}
				<StateCombobox
					state={$page.data.states?.find((state) => state.id === entry.bookmark.stateId)}
					onSelect={async (state) => {
						const s = syncStore.add();
						await trpc().bookmarks.updateState.mutate({
							id: $page.data.article.bookmark?.id,
							stateId: state.id,
							entryId: $page.data.article.id,
						});
						await invalidateAll();
						syncStore.remove(s);
					}}
				/>
				<!-- <StateListbox
					state={$page.data.states?.find(
						(state) => state.id === entry.bookmark.stateId || $page.data.user?.default_state_id
					)}
				/> -->
			{/if}
			{#if entry.tags}
				<div transition:slide|local>
					<TagInputCombobox bind:tags={entry.tags} original={{ ...entry }} />
				</div>
			{/if}
			{#if entry.context}
				{JSON.stringify(entry.context)}
			{/if}

			Note:
			<GenericTextarea />
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
						<!-- should maybe be an a or button -->
						<div
							class="flex flex-col space-y-2 border-b border-gray-300 py-4"
							on:click={() => {
								// todo: hide if small
								// naive way of doing this, but it should work for now
								document.querySelector(`[data-annotation-id="${annotation.id}"]`)?.scrollIntoView({
									block: 'center',
									inline: 'start',
									behavior: 'smooth',
								});
							}}
							on:keydown
						>
							<div class="border-l border-amber-200 px-3">{target.selector.exact}</div>
							{#if annotation.body}
								<span class="max-w-max rounded-full border border-lime-400 py-2 px-3"
									>{annotation.body}</span
								>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</aside>
{/if}
