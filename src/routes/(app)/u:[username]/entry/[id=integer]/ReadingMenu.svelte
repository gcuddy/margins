<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidate, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { createTemporaryAnnotation } from '$lib/annotation';
	import type { EntryWithBookmark } from '$lib/entry.server';
	import type { ICurrentList } from '$lib/stores/currentList';
	import { mainEl, mainElScroll } from '$lib/stores/main';
	import scrollDirection from '$lib/stores/scrollDirection';
	import type { Bookmark, Entry } from '@prisma/client';
	import type { Metadata } from './types';
	import { fly } from 'svelte/transition';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';
	import CircularProgressBar from '$lib/components/CircularProgressBar/CircularProgressBar.svelte';
	import DotMenu from '$lib/components/DotMenu.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import LinkPreview from '$lib/components/LinkPreview.svelte';
	// import ReadingSidebar from './ReadingSidebar.svelte';
	import type { ExtendedBookmark } from '$lib/bookmark';
	import ReadingSidebar from './ReadingSidebar.svelte';
	import type { RouterInputs, RouterOutputs } from '$lib/trpc/router';
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import LocationListbox from '$lib/components/LocationListbox.svelte';
	import StateListbox from '$lib/components/StateListbox.svelte';
	import { derived } from 'svelte/store';

	export let entry: RouterOutputs['entries']['load'];
	export let bookmark: ExtendedBookmark | null = null;
	export let interaction: { is_read: boolean | null } | null = null;
	export let reading_sidebar_active = false;

	// export let currentList: ICurrentList | undefined = undefined;

	$: currentList = $page.data.currentList;

	const scrollDown = scrollDirection($mainEl);
	$: ({ user } = $page.data);

	let lastScroll = 0;
	let down = false;
	function checkDown() {
		console.log({
			lastScroll,
			$mainElScroll,
		});
		if ($mainElScroll.y > lastScroll) {
			return true;
		} else {
			return false;
		}
		lastScroll = $mainElScroll.y;
	}
	$: down = checkDown();
	$: console.log({ down });
	$: console.log($mainElScroll.down);

	$: console.log({ entry });

	let saved_position: number | null;
	let ticking = true;
	function handleScrollToTop() {
		saved_position = $mainElScroll.y;
		console.log({ saved_position });
		$mainEl.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
		const checkIfScrollIsStatic = setInterval(() => {
			if ($mainEl.scrollTop === 0) {
				clearInterval(checkIfScrollIsStatic);
				ticking = false;
			}
		}, 50);
	}
	function returnToPosition() {
		console.log({ saved_position });
		$mainEl.scrollTo({
			top: saved_position as number,
			left: 0,
			behavior: 'smooth',
		});
		saved_position = null;
	}
	// $: if (saved_position)
	$: if (!ticking && $mainElScroll.offset > 0.05) {
		// saved_position = null;
	}
	let moused_over = false;
	$: hide =
		!moused_over &&
		$mainElScroll.down &&
		$mainElScroll.y > 500 &&
		$mainElScroll.offset < 0.99 &&
		!reading_sidebar_active &&
		$currentList?.type !== 'rss';

	$: back = $currentList?.slug ?? '';
	$: index = $currentList?.ids?.findIndex((id) => id === entry.id);
	$: prev = index ? $currentList?.ids?.[index - 1] : undefined;
	$: next = index || index === 0 ? $currentList?.ids?.[index + 1] : undefined;
	$: next_url = next ? `/u:${$page.data.user?.username}/entry/${next}` : undefined;
	$: prev_url = prev ? `/u:${$page.data.user?.username}/entry/${prev}` : undefined;

	$: console.log({ index, next, prev });

	// preload next and prev
	$: next_url && preloadData(next_url);
	$: prev_url && preloadData(prev_url);

	let downloading = false;
</script>

<svelte:window
	on:keydown={async (e) => {
		if ($disableGlobalKeyboardShortcuts) return;
		if (e.key === 'j' && next_url) {
			console.log({ next_url });
			await goto(next_url);
		}
		if (e.key === 'k' && prev_url && !e.metaKey) {
			await goto(prev_url);
		}
		if (e.key === 'Escape' && back) {
			await goto(back);
		}
		if (e.key === 'i' && e.metaKey) {
			reading_sidebar_active = !reading_sidebar_active;
		}
	}}
/>
<!-- -translate-y-12 -->
<!-- going with h-14 which means mt-14 for other stuff -->
<div
	class="absolute top-0 z-20 flex h-14 min-h-[56px] w-full  transform-cpu border-b bg-stone-50/90 py-1 px-2 backdrop-blur-lg transition duration-500 hover:opacity-100 dark:border-black dark:bg-stone-800/90
  {hide ? ' -translate-y-full' : ' translate-y-0'}
    after:absolute after:top-0 after:left-0 after:-z-10 after:h-16 after:w-full after:content-[''] md:px-3"
	on:mouseenter={() => {
		moused_over = true;
	}}
	on:mouseleave={() => {
		moused_over = false;
	}}
>
	<div class="mr-auto flex flex-1 items-center gap-2">
		<a class="flex items-center md:pl-0" href={$currentList?.slug || '/'}
			><Icon name="arrow" direction="w" />
			<span class="sr-only">Go back</span></a
		>

		{#if prev}
			<Button
				variant="ghost"
				as="a"
				href={prev_url}
				className="w-7 {prev ? '' : 'opacity-60'}"
				disabled={prev === undefined}
			>
				<Icon name="chevronUp" className="h-4 w-4 stroke-current" />
			</Button>
		{/if}
		{#if next}
			<Button
				variant="ghost"
				as="a"
				href={next_url}
				className="w-7 {next ? '' : 'opacity-60'}"
				disabled={next === undefined}
			>
				<Icon name="chevronDown" className="h-4 w-4 stroke-current" />
			</Button>
		{/if}
		<!-- SAVE TO LIBRARY -->
		<!-- TODO: what should this show when it's saved? Should it show "un-save"? Archive? Star? Nothing? Maybe it should only show when in RSS? -->
		<form
			action="?/save"
			method="post"
			use:enhance={({ form }) => {
				// Optimistic UI
				const temp_id = Math.random();
				const og = bookmark;
				if (bookmark) {
					bookmark = null;
				} else {
					//@ts-ignore
					bookmark = {
						id: temp_id,
					};
				}
				const button = form.querySelector('button');
				if (button) button.disabled = true;
				return async ({ update, result }) => {
					if (button) button.disabled = false;
					console.log({ result });
					if (result.type === 'error') update();
					if (result.type === 'success') {
						if (result.data) bookmark = result.data.bookmark;
						// else -> invalidate
					}
				};
			}}
		>
			<input type="hidden" name="id" value={bookmark?.id} />
			<input type="hidden" name="uri" value={entry.uri} />
			<Button
				type="submit"
				variant="naked"
				tooltip={{
					text: `${bookmark ? 'Remove from' : 'Save to'} library`,
					kbd: 's',
				}}
				><Icon
					name="bookmarkMini"
					className="h-4 w-4 {bookmark ? 'fill-current' : 'stroke-current'}"
				/></Button
			>
		</form>
		<!-- {#if entry.bookmark}
			<StateListbox
				label={false}
				state={$page.data.states?.find(
					(state) => state.id === entry.bookmark.stateId || $page.data.user?.default_state_id
				)}
			/>
		{/if} -->
		<!-- (Re-)download full article -->
		<!-- This should have encouraged placement if the content is short and especially if it's a feed -->
		<!-- TODO: It should also show an "active" state if the item has a reader view. Need to figure out how to save that. -->
		<!-- TODO: only show this if it's type article -->
		{#if entry.feedId && !entry.custom}
			<form
				action="/u:{$page.data.user?.username}/entry/{entry.id}?/download"
				method="POST"
				use:enhance={() => {
					downloading = true;
					return async ({ form, update }) => {
						downloading = false;
						update();
					};
				}}
			>
				<Button
					variant="naked"
					className="w-7 {downloading ? '!animate-pulse' : ''}"
					tooltip={{ text: 'Download article text' }}
					type="submit"
					disabled={downloading}
				>
					<input type="hidden" name="url" value={entry.uri} />
					<!-- <Icon name="documentArrowDownMini" className="h-5 w-5" /> -->
					<Icon name="article" className="h-4 w-4 fill-none stroke-current" />
				</Button>
			</form>
		{/if}
	</div>
	<div
		class=" flex flex-1 -translate-y-24 transform-cpu items-center justify-center opacity-0 transition-all {$mainElScroll.y >
			135 && !reading_sidebar_active
			? '!translate-y-0 !opacity-100'
			: ''}"
	>
		<!-- This should check when the header is off screen. When it is, it should receive the Title and gently transition it in. -->

		<div
			class="flex grid-cols-4 items-center gap-2"
			on:click={handleScrollToTop}
			on:keydown
			aria-label="Click to scroll to top"
			title="Click to scroll to top"
		>
			<!-- TODO: clicking this will send you back to top, but save current scroll -->
			<div
				class="col-span-2  flex w-52 max-w-xs shrink flex-col text-center text-sm sm:w-auto md:max-w-md lg:max-w-lg"
			>
				<span class="truncate">{entry.title}</span>
				{#if entry.author}
					<div class="truncate">
						<Muted>{entry.author}</Muted>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="ml-auto flex flex-1 items-center justify-end space-x-2">
		<div class="col-span-1 ml-auto hidden shrink items-center sm:flex">
			<CircularProgressBar
				minValue={0}
				maxValue={1}
				value={$mainElScroll.offset}
				className="h-4 w-4 stroke-2 transition-all"
				trailClass="stroke-gray-400"
				pathClass={$mainElScroll.offset < 0.99 ? 'stroke-primary-600' : 'stroke-lime-600'}
			/>
		</div>
		{#if entry.unread}
			<div class="h-2 w-2 rounded-full bg-sky-400" />
		{/if}
		<Button variant="naked" className="w-7">
			<Icon name="documentAdd" className="h-4 w-4 stroke-current" />
		</Button>
		<DotMenu
			items={[
				[
					{
						label: `Mark as ${entry.unread ? 'read' : 'unread'}`,
						icon: 'unread',
						perform: async () => {
							const is_read = interaction?.is_read || false;
							interaction = { ...interaction, is_read: !is_read };
							const res = await fetch(`/api/interactions`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									is_read: !is_read,
									entryId: entry.id,
								}),
							});
							const updated = await res.json();
							interaction = updated;
						},
					},
					{
						label: 'Tag',
						icon: 'tagSolid',
					},
					{
						label: 'Archive',
						icon: 'archiveSolid',
					},
				],
			]}
		/>
		<Button
			on:click={() => (reading_sidebar_active = !reading_sidebar_active)}
			className="group"
			variant="naked"
			tooltip={{
				text: `${reading_sidebar_active ? 'Hide' : 'Show'} sidebar`,
				kbd: '⌘ i',
			}}
		>
			<!-- <svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />

				<line x1="14" y1="3" x2="14" y2="21" />
			</svg> -->
			<Icon
				name="sidebar"
				className="h-5 w-5 stroke-2 stroke-current relative top-px  transition-all {reading_sidebar_active &&
					'fill-primary-100 dark:fill-gray-900'}"
			/>
		</Button>
	</div>
</div>

<!-- Return to position -->

{#if saved_position && $mainElScroll.offset < 0.02}
	<div
		transition:fly={{
			y: 10,
		}}
		class="fixed bottom-4 right-4 text-2xl sm:right-8"
	>
		<Button on:click={returnToPosition} variant="ghost">Return to position</Button>
	</div>
{/if}
