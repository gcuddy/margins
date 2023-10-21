<script context="module" lang="ts">
	export const leftSidebarPortal = make_portal('[data-left-sidebar]');
</script>

<script lang="ts">
	import {
		ArrowLeft,
		ChevronDown,
		ChevronUp,
		PanelLeftCloseIcon,
		PanelLeftOpenIcon,
	} from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentEntryList } from '$components/entries/store';
	import { Button, type ButtonProps } from '$components/ui/button';
	import { make_portal } from '$lib/actions/utils';
	import { make_link } from '$lib/utils/entries';
	import { cn } from '$lib/utils/tailwind';

	import { backContext } from './[id]/store';
	import { getEntryContext } from './ctx';
	import * as Sheet from '$components/ui/sheet';
	import Toc from './TOC.svelte';

	$: entryId = $page.data.entry?.id;
	$: currentIndex = $currentEntryList.findIndex(
		(entry) => entry.id === entryId,
	);
	$: prev = $currentEntryList[currentIndex - 1];
	$: next = $currentEntryList[currentIndex + 1];
	$: prev_link = prev ? make_link(prev) : null;
	$: next_link = next ? make_link(next) : null;

	export let show = false;

	const { scrollingDown } = getEntryContext();

	const { navWidth } = getEntryContext();

	let borderBoxSize:
		| Array<{ blockSize: number; inlineSize: number }>
		| undefined
		| null;
	$: if (borderBoxSize) {
		const newWidth = borderBoxSize.at(-1)?.inlineSize;
		if (newWidth) {
			$navWidth = newWidth;
		}
	}

	const inArticle: Writable<boolean> = getContext('inArticle');
	const mainNavWidth: Writable<number> = getContext('mainNavWidth');
	const mobileNavWidth: Writable<number> = getContext('mobileNavWidth');
	let showLeftSidebar = false;

	$: nextLinkProps = (
		next_link
			? {
					href: next_link,
					// disabled: undefined
			  }
			: {
					// href: undefined,
					disabled: true,
			  }
	) satisfies ButtonProps;

	$: prevLinkProps = (
		prev_link
			? {
					href: prev_link,
					// disabled: undefined
			  }
			: {
					// href: undefined,
					disabled: true,
			  }
	) satisfies ButtonProps;
</script>

<nav
	bind:borderBoxSize
	style:--left={$inArticle ? 0 : `${$mainNavWidth}px`}
	style:--mobile-left={$inArticle ? 0 : `${$mobileNavWidth}px`}
	class={cn(
		'h-[--nav-height] left-0 sm:left-[--mobile-left] lg:[--left] flex items-center transition-transform transform fixed  top-0 z-40 pl-4 w-full',
		!show && 'w-min max-w-min border-b',
		$scrollingDown && '-translate-y-full',
		// $rightSidebar && 'opacity-0'
	)}
>
	<Button variant="ghost" href={$backContext}>
		<ArrowLeft />
	</Button>
	{#if $page.data.type === 'article' || $page.data.type === 'pdf'}
		<!-- TODO -->
		<Sheet.Root bind:open={showLeftSidebar}>
			<Sheet.Trigger asChild let:builder>
				<Button on:click={(e) => {
                    if (showLeftSidebar) {
                        // the default is for melt-ui to open on click - but we want to close
                        e.preventDefault();
                    }
                }} builders={[builder]} variant="ghost">
					<svelte:component
						this={showLeftSidebar ? PanelLeftCloseIcon : PanelLeftOpenIcon}
						class="h-4 w-4 stroke-[1.5]"
					/>
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="left" class="w-4/5 sm:w-3/4">
				{#if $page.data.type === 'article'}
					<!-- <aside
                    class="fixed w-72 left-0 top-0 bottom-0 pt-20"
                    data-left-sidebar
					> -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- 4 rem (todo: use constants.ts) -->
					<div
						class="mt-16 text-sm"
						on:click={() => {
							console.log('click');
							showLeftSidebar = false;
						}}
					>
						{#key $page.url.pathname}
							<Toc />
						{/key}
					</div>
					<!-- </aside> -->
				{/if}
			</Sheet.Content>
		</Sheet.Root>
	{/if}
	{#if currentIndex > -1 && $currentEntryList.length}
		<div class="flex items-center">
			<!--  -->
			<div class="flex items-center max-sm:hidden">
                <Button {...prevLinkProps} variant="ghost">
                    <ChevronUp />
                </Button>
                <Button {...nextLinkProps} variant="ghost">
                    <ChevronDown />
                </Button>
            </div>
			<div class="flex shrink-0">
				<span class="text-xs font-normal text-left tabular-nums"
					>{currentIndex + 1}
					<span class="text-muted-foreground">/ {$currentEntryList.length}</span
					></span
				>
			</div>
		</div>
	{/if}
</nav>

{#if currentIndex > -1 && $currentEntryList.length}
	<div class="flex justify-center items-center sm:hidden fixed bottom-0 h-14 w-full bg-background/95 z-10">
		<!--  -->
		<Button {...prevLinkProps} class="grow" variant="ghost">
			<ChevronUp />
		</Button>
		<Button {...nextLinkProps} class="grow" variant="ghost">
			<ChevronDown />
		</Button>
	</div>
{/if}
