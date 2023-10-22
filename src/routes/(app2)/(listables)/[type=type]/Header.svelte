<script lang="ts">
	import { isHTMLInputElement } from '@melt-ui/svelte/internal/helpers';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import {
		MoreHorizontal,
		PinIcon,
		ZoomInIcon,
		ZoomOutIcon,
	} from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { derived, type Writable } from 'svelte/store';
	import * as Sheet from '$components/ui/sheet';
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

	import { Progress } from '$components/ui/progress';
	import { Label } from '$components/ui/label';

	import ArticleAppearanceOptions from './[id]/article-appearance-options.svelte';
	import EntryOperations from './[id]/EntryOperations.svelte';
	import { getArticleContext, getEntryContext } from './ctx';
	import {
		ActivityLog,
		MixerHorizontal,
		ChevronRight,
        DotsHorizontal
	} from 'radix-icons-svelte';
	import { make_link } from '$lib/utils/entries';
	import MobileLink from '$components/nav/mobile-link.svelte';
	import { fly } from 'svelte/transition';
	import TransitionContainer from '$components/transition-container.svelte';
	import ArticleAppearanceOptionsContent from './[id]/article-appearance-options-content.svelte';
	import { entryCommands } from '$components/entries/operations';

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
				if (isPinned) {
					return isPinned;
				}
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
		if (!isHTMLInputElement(e.target)) {
			return;
		}
		$pdf_state.pdf_link_service?.goToPage(Number(e.target.value));
		e.target.blur();
	}

	let optionsPages: Array<string> = [];
	$: optionPage = optionsPages[optionsPages.length - 1];
    let optionsOpen = false;

    const queryClient = useQueryClient();

	// TODO: await tick after navigating before listening to scrollingDown
</script>

{#if $scrollingDown}
	<div
		class="fixed flex items-center justify-between left-0 top-0 h-[--nav-height] bg-transparent {$rightSidebar
			? 'w-full lg:w-[calc(100%-var(--right-sidebar-width))]'
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
		'fixed flex items-center justify-between z-30 left-0 sm:left-[--mobile-left] lg:left-[--left] top-0 h-[--nav-height] border-b bg-background transition-transform duration-200 ease-in-out transform w-full sm:w-[calc(100%-var(--mobile-nav-width))]',
		$scrollingDown && '-translate-y-full',
		$rightSidebar
			? 'pr-14 md:pr-0 lg:w-[calc(100%-var(--right-sidebar-width)-var(--main-nav-width))]'
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
						if (!$pdf_state.pdf_viewer) {
							return;
						}
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
		<div class="flex md:hidden">
			<Sheet.Root
                bind:open={optionsOpen}
				onOpenChange={() => {
					optionsPages = [];
				}}
			>
				<Sheet.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>
						<MoreHorizontal class="h-4 w-4" />
					</Button>
				</Sheet.Trigger>
				<Sheet.ContentBottom>
					<TransitionContainer>
						{#if !optionPage}
							<div
								transition:fly={{
									x: '-100%',
								}}
							>
								<div class="flex flex-col space-y-1.5 pb-6">
									<span class="font-semibold leading-none tracking-tight">
										Options
									</span>
									{#if $page.data.entry?.title}
										<span class="text-sm text-muted-foreground">
											{$page.data.entry?.title}
										</span>
									{/if}
									<!-- {#if $page.data.entry?.type === 'article'}
                                <span class="text-sm text-muted-foreground">
                                    <Label for="progress">Progress: {Math.ceil($progress * 100)}%</Label>
                                                            <Progress id="progress" max={100} value={Math.ceil($progress * 100)} />
                                </span>
                            {/if} -->
								</div>
								{#if $page.data.entry}
									<MobileLink
                                        bind:open={optionsOpen}
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
										<span class="">{$pin ? 'Remove pin' : 'Pin'}</span>
									</MobileLink>
									<MobileLink bind:open={optionsOpen} href="{make_link($page.data.entry)}/activity">
										<ActivityLog class="h-4 w-4" />
										<span>Show activity log</span>
									</MobileLink>
								{/if}
								{#if $page.data.entry?.type === 'article'}
									<MobileLink
										on:click={() => {
											optionsPages = [...optionsPages, 'appearance_options'];
										}}
									>
										<MixerHorizontal class="h-4 w-4" />
										<span class="grow text-left">Appearance options</span>
										<ChevronRight class="h-4 w-4 text-muted-foreground" />
									</MobileLink>
								{/if}
								{#if $page.data.entry}
									<!-- <EntryOperations
										entry={$page.data.entry}
										data={$page.data.annotationForm}
									/> -->
                                    <MobileLink
										on:click={() => {
											optionsPages = [...optionsPages, 'entry_operations'];
										}}
									>
										<DotsHorizontal class="h-4 w-4" />
										<span class="grow text-left">Actions</span>
										<ChevronRight class="h-4 w-4 text-muted-foreground" />
									</MobileLink>
								{/if}
							</div>
						{:else if optionPage === 'appearance_options'}
							<div
								transition:fly={{
									x: '100%',
								}}
							>
								<div class="flex flex-col space-y-1.5 pb-6">
									<span class="font-semibold leading-none tracking-tight">
										Appearance Options
									</span>
								</div>
                                <ArticleAppearanceOptionsContent />
							</div>
						{:else if optionPage === 'entry_operations'}
							<div
								transition:fly={{
									x: '100%',
								}}
							>
								<div class="flex flex-col space-y-1.5 pb-6">
									<span class="font-semibold leading-none tracking-tight">
										Actions
									</span>
								</div>
                                <div class="flex flex-col">
                                    {#each entryCommands(queryClient) as command}
                                        <MobileLink
                                            bind:open={optionsOpen}
                                            on:click={() => {
                                                command.action?.($page.data.entry);
                                            }}
                                        >
                                            <svelte:component this={command.icon} class="mr-2"></svelte:component>
                                            <span>{command.text}</span>
                                        </MobileLink>
                                    {/each}
                                </div>
							</div>

						{/if}
					</TransitionContainer>
				</Sheet.ContentBottom>
			</Sheet.Root>
		</div>
		<div class="right hidden md:flex gap-x-4 items-center">
			{#if $page.data.entry}
				<Button
					href="{make_link($page.data.entry)}/activity"
					variant="ghost"
					size="icon"
				>
					<ActivityLog />
				</Button>
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
			<!-- {#if $page.data.entry}
				<EntryOperations
					entry={$page.data.entry}
					data={$page.data.annotationForm}
				/>
			{/if} -->
		</div>
	</div>
</div>
<!-- Floating Sidebar button (can't put in right because want it to show ) -->

<EntrySidebarButton open={rightSidebar} class="hidden lg:flex" />
