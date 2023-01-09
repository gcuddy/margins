<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { clickOutside } from '$lib/actions/clickOutside';
	import type { ExtendedBookmark } from '$lib/bookmark';
	import Annotation from '$lib/components/Annotation.svelte';
	import AnnotationInput from '$lib/components/annotations/AnnotationInput.svelte';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Button from '$lib/components/Button.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import GenericTextarea from '$lib/components/GenericTextarea.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import StateCombobox from '$lib/components/StateCombobox.svelte';
	import StateListbox from '$lib/components/StateListbox.svelte';
	import TagInputCombobox from '$lib/components/TagInputCombobox.svelte';
	import type { EntryWithBookmark } from '$lib/entry.server';
	import { checkIfKeyboardShortcutsAllowed } from '$lib/stores/keyboard';
	import mq from '$lib/stores/mq';
	import { syncStore } from '$lib/stores/sync';
	import { trpc } from '$lib/trpc/client';
	import { TextQuoteTarget } from '$lib/types/schemas/Annotations';
	import type { Tag } from '@prisma/client';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { tweened } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { fade, fly, slide } from 'svelte/transition';
	import { match } from 'ts-pattern';
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

	let noting = false;

	const busy = writable({
		note: false,
	});
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			if (checkIfKeyboardShortcutsAllowed()) {
				active = false;
			}
		}
	}}
/>

<!-- mt-8 to account for reading menu -->
{#if display}
	<div class="inset-0 hidden  max-md:fixed max-md:block" />
	<aside
		style:margin-left="{$WIDTH_SPRING * -1}px"
		style:width="{WIDTH}px"
		style:transform="translateX({$WIDTH_SPRING}px)"
		class="z-10 mt-14 flex max-h-full flex-col space-y-5 overflow-auto overflow-y-auto border-gray-200 bg-gray-50 p-4 shadow-lg backdrop-blur-md transition-shadow dark:border-gray-700 dark:bg-transparent dark:bg-gradient-to-br dark:from-gray-800/90  dark:to-gray-900/90 dark:shadow-stone-900 max-md:absolute max-md:top-0 max-md:right-0 max-md:bottom-0 max-md:border-l sm:w-96 md:relative"
	>
		<!-- <div class="absolute top-0 left-0 h-full w-full bg-red-500" style:width="450px" /> -->

		<div class="flex flex-col gap-y-2 divide-y dark:divide-gray-700/40">
			<div class="flex flex-col gap-y-1">
				<span class="text-lg font-semibold">{entry.title}</span>
				<span class="text-base font-medium">{entry.author}</span>
				{#if entry.type === 'rss' || entry.feedId}
					<!-- display feed -->
					<!-- Or just put this in context section -->
					subscription: {$page.data.subscriptions?.find((s) => s.feedId === entry.feedId)?.title}
				{/if}
				<div class="grid grid-cols-[minmax(90px,_auto)_1fr] items-center">
					{#if entry.bookmark?.stateId}
						<div class="min-w-[90px]"><SmallPlus><Muted>Status</Muted></SmallPlus></div>
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
					{/if}
					<SmallPlus><Muted>Tags</Muted></SmallPlus>
					<TagInputCombobox bind:tags={entry.tags} original={{ ...entry }} />
				</div>
				<!-- <StateListbox
							state={$page.data.states?.find(
								(state) => state.id === entry.bookmark.stateId || $page.data.user?.default_state_id
							)}
						/> -->
			</div>

			{#if entry.context}
				{JSON.stringify(entry.context)}
			{/if}

			<div class="flex flex-col gap-3 p-2 text-sm">
				<span class="text-gray-400">Notes</span>
				{#if pageNotes}
					<!-- TODO: use-dndzone -->
					<div>
						{#each pageNotes as annotation (annotation.id)}
							<div
								animate:flip
								in:slide|local
								out:slide|local={{
									duration: 150,
								}}
							>
								<Annotation {annotation} />
							</div>
						{/each}
					</div>
				{/if}

				{#if !noting}
					<button
						in:fade|local={{ delay: 400 }}
						class="flex items-center self-end rounded-lg p-1.5 text-xs font-medium dark:hover:bg-gray-700/50 "
						on:click={() => (noting = true)}
					>
						<Icon name="plusMini" className="h-4 w-4 fill-gray-400" />
						<Muted>Add note</Muted></button
					>
				{:else}
					<!-- REVIEW: is this action ok, since reading sidebar will always be in the entry? -->
					<!-- TODO: optimistic update  -->
					<form
						method="post"
						action="?/note"
						use:enhance={({}) => {
							$busy.note = true;
							return async ({ result, update }) => {
								console.log({ result });
								await update({
									reset: false,
								});
								$busy.note = false;
								noting = false;
							};
						}}
						transition:fly={{ y: -10 }}
						on:keydown={(e) => {
							if (e.key === 'escape') {
								// todo: noting = false
							}
						}}
					>
						<AnnotationInput
							placeholder="Add a page note…"
							rows={1}
							shadow_focus={true}
							include_tags={false}
							confirmButtonStyle="ghost"
							class="text-sm"
						>
							<svelte:fragment slot="buttons">
								<Button
									type="reset"
									on:click={() => (noting = false)}
									variant="ghost"
									size="sm"
									className="text-sm">Cancel</Button
								>
								<Button
									type="submit"
									disabled={$busy.note}
									variant="ghost"
									size="sm"
									className="text-sm"
									>{#if $busy.note}
										<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
									{:else}
										Save
									{/if}
								</Button>
							</svelte:fragment>
						</AnnotationInput>
					</form>
				{/if}
			</div>
			<!-- Note: -->
			<!-- <GenericTextarea /> -->

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
