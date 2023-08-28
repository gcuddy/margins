<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { InfoIcon, PinIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { derived, type Writable, writable } from 'svelte/store';

	import { page } from '$app/stores';
	import EntrySidebarButton from '$components/entries/entry-sidebar-button.svelte';
	import { getPdfStateContext } from '$components/pdf-viewer/utils';
	import Button from '$components/ui/Button.svelte';
	import {
		initCreatePinMutation,
		initDeletePinMutation,
	} from '$lib/queries/mutations';
	import { queryFactory } from '$lib/queries/querykeys';
	import mq from '$lib/stores/mq';
	import { cn } from '$lib/utils/tailwind';

	import ArticleAppearanceOptions from './[id]/article-appearance-options.svelte';
	import EntryOperations from './[id]/EntryOperations.svelte';
	import { getArticleContext, getEntryContext } from './ctx';

	export let scrollingDown = getContext('scrollingDown') || writable(false);

	$: hide = $scrollingDown;

	$: console.log({ $scrollingDown });

	const { rightSidebar } = getEntryContext();

	const jumping = getContext('jumping');

	const shouldHide = derived([scrollingDown, mq], ([$scrollingDown, $mq]) => {
		return $scrollingDown || ($mq.max_md && $rightSidebar);
	});

	const pdf_state = getPdfStateContext();
	const { navWidth } = getEntryContext();
	$: opts = $pdf_state.opts;


	const mainNavWidth = getContext('mainNavWidth');
	const mobileNavWidth = getContext('mobileNavWidth');
	const inArticle = getContext('inArticle');

	const pins = createQuery(queryFactory.pins.list());
	const pin = derived(pins, ($pins) => {
		return $pins.data?.find((pin) => pin.entry?.id === $page.data.entry?.id);
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

	// TODO: await tick after navigating before listening to scrollingDown
</script>

<!--  -->
<!-- TODO: Hidden Header for showing on hover -->

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
	style:--main-nav-width={$inArticle ? `0px` : $mainNavWidth + 'px'}
	style:--mobile-nav-width={$inArticle ? `0px` : $mobileNavWidth + 'px'}
	style:--left={$inArticle ? 0 : $mainNavWidth + 'px'}
	style:--mobile-left={$inArticle ? 0 : $mobileNavWidth + 'px'}
	class={cn(
		'fixed flex items-center justify-between z-50 left-0 sm:left-[--mobile-left] lg:left-[--left] top-0 h-[--nav-height] border-b bg-background transition-transform duration-200 ease-in-out transform w-full sm:w-[calc(100%-var(--mobile-nav-width))]',
		$scrollingDown && '-translate-y-full',
		$rightSidebar
			? 'pr-14 md:pr-0 md:w-[calc(100%-var(--right-sidebar-width)-var(--main-nav-width))]'
			: 'pr-14', // pr-14 because button is w-10 r-4
		// $rightSidebar && $mq.max_md && 'opacity-0'
	)}
>
	<div class="flex items-start justify-start w-full relative px-4">
		<div class="left" style:padding-left="{$navWidth}px">
			{#if $page.data.entry?.type === 'pdf'}
				{$pdf_state.pdf_viewer?.currentScaleValue}

				<button on:click={pdf_state.zoomIn}> Zoom in </button>
				<button on:click={pdf_state.zoomOut}> Zoom Out </button>

				<button
					on:click={() => {
						if (!$pdf_state.pdf_viewer) return;
						$pdf_state.pdf_viewer.currentScaleValue = 'auto';
						console.log($pdf_state);
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
								entryId: $page.data.entry.id,
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
			<EntryOperations
				entry={$page.data.entry}
				data={$page.data.annotationForm}
			/>
		</div>
	</div>
</div>
<!-- Floating Sidebar button (can't put in right because want it to show ) -->

<EntrySidebarButton open={rightSidebar} class="hidden md:flex" />
