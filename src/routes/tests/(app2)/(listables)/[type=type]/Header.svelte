<script lang="ts">
	import { isHTMLInputElement } from '@melt-ui/svelte/internal/helpers';
	import { createQuery } from '@tanstack/svelte-query';
	import { PinIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { derived, type Writable } from 'svelte/store';

	import { page } from '$app/stores';
	import EntrySidebarButton from '$components/entries/entry-sidebar-button.svelte';
	import { getPdfStateContext } from '$components/pdf-viewer/utils';
	import { Button } from '$components/ui/button';
	import Input from '$components/ui/input/input.svelte';
	import {
		initCreatePinMutation,
		initDeletePinMutation,
	} from '$lib/queries/mutations';
	import { queryFactory } from '$lib/queries/querykeys';
	import { cn } from '$lib/utils/tailwind';

	import ArticleAppearanceOptions from './[id]/article-appearance-options.svelte';
	import EntryOperations from './[id]/EntryOperations.svelte';
	import { getArticleContext, getEntryContext } from './ctx';

	const { scrollingDown } = getEntryContext();

	const { rightSidebar } = getEntryContext();

	const pdf_state = getPdfStateContext();
	const { navWidth } = getEntryContext();
	$: opts = $pdf_state.opts;

	const mainNavWidth: Writable<number> = getContext('mainNavWidth');
	const mobileNavWidth: Writable<number> = getContext('mobileNavWidth');
	const inArticle: Writable<boolean> = getContext('inArticle');

	const pins = createQuery(queryFactory.pins.list());
	const pin = derived([pins, page], ([$pins, $page]) => {
		return $pins.data?.find((pin) => {
			if ($page.data.entry) {
				const isPinned = pin.entry?.id === $page.data.entry.id;
				if (isPinned) {return isPinned;}
				// check children
				return pin.children?.find(
					(child) => child.entry?.id === $page.data.entry?.id,
				);
			}
			return false;
		});
	});
	const topSortOrder = derived(
		pins,
		($pins) => $pins.data?.[0]?.sortOrder ?? 0,
	);
	const createPin = initCreatePinMutation();
	const deletePin = initDeletePinMutation();

	const {
		states: { progress },
	} = getArticleContext();

    function handlePageInputChange(e: Event) {
        if (!isHTMLInputElement(e.target)) {return;}
        $pdf_state.pdf_link_service?.goToPage(Number(e.target.value));
        e.target.blur();
    }

	// TODO: await tick after navigating before listening to scrollingDown
</script>

{#if $scrollingDown}
	<div
		class="fixed flex items-center justify-between left-0 top-0 h-[--nav-height] bg-transparent {$rightSidebar
			? 'w-full md:w-[calc(100%-var(--right-sidebar-width))]'
			: 'w-full'}"
		aria-hidden="true"
		on:mouseenter={() => ($scrollingDown = false)}
	/>
{/if}

<div
	style:--main-nav-width={$inArticle ? `0px` : `${$mainNavWidth}px`}
	style:--mobile-nav-width={$inArticle ? `0px` : `${$mobileNavWidth}px`}
	style:--left={$inArticle ? 0 : `${$mainNavWidth}px`}
	style:--mobile-left={$inArticle ? 0 : `${$mobileNavWidth}px`}
	class={cn(
		'fixed flex items-center justify-between z-50 left-0 sm:left-[--mobile-left] lg:left-[--left] top-0 h-[--nav-height] border-b bg-background transition-transform duration-200 ease-in-out transform w-full sm:w-[calc(100%-var(--mobile-nav-width))]',
		$scrollingDown && '-translate-y-full',
		$rightSidebar
			? 'pr-14 md:pr-0 md:w-[calc(100%-var(--right-sidebar-width)-var(--main-nav-width))]'
			: 'pr-14', // pr-14 because button is w-10 r-4
	)}
>
	<div class="flex items-start justify-start w-full relative px-4">
		<div class="left flex" style:padding-left="{$navWidth}px">
			{#if $page.data.entry?.type === 'pdf'}
				<Button variant="ghost" size="icon" on:click={pdf_state.zoomIn}>
					<ZoomInIcon class="h-4 w-4" /> <span class="sr-only">Zoom in</span>
				</Button>
				<Button variant="ghost" size="icon" on:click={pdf_state.zoomOut}>
					<ZoomOutIcon class="h-4 w-4" /> <span class="sr-only">Zoom out</span>
				</Button>
				<Input
					type="number"
					class="w-min appearance-none text-xs tabular-nums m-0"
                    on:change={handlePageInputChange}
                    value={$pdf_state.pageNumber}
				/>

				<button
					on:click={() => {
						if (!$pdf_state.pdf_viewer) {return;}
						$pdf_state.pdf_viewer.currentScaleValue = 'auto';
					}}
				>
					Auto
				</button>

				<button
					on:click={() => {
						$opts.darkModeInvert = !$opts.darkModeInvert;
					}}
				>
					dark mode
				</button>
			{/if}
			<!--  -->
		</div>
		<div class="center flex-1">
			<!--  -->
		</div>
		<div class="right flex gap-x-4 items-center">
			{#if $page.data.entry}
				<Button
					variant="ghost"
					class="group"
					on:click={() => {
						// todo: make this a form
						if ($pin) {
							$deletePin.mutate({
								id: $pin.id,
							});
						} else {
							$createPin.mutate({
								entryId: $page.data.entry?.id,
								sortOrder: $topSortOrder - 1,
							});
						}
					}}
				>
					<PinIcon
						class={cn(
							'h-4 w-4 transition-transform group-hover:rotate-6',
							$pin && 'fill-accent-foreground',
						)}
					/>
					<span class="sr-only">{$pin ? 'Remove pin' : 'Pin'}</span>
				</Button>
			{/if}
			{#if $page.data.entry?.type === 'article'}
				<span class="text-sm text-muted-foreground">
					{Math.ceil($progress * 100)}%
				</span>
				<ArticleAppearanceOptions />
			{/if}
			{#if $page.data.entry}
				<EntryOperations
					entry={$page.data.entry}
					data={$page.data.annotationForm}
				/>
			{/if}
		</div>
	</div>
</div>
<!-- Floating Sidebar button (can't put in right because want it to show ) -->

<EntrySidebarButton open={rightSidebar} class="hidden md:flex" />

