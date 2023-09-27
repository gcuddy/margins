<script context="module" lang="ts">
	export const leftSidebarPortal = make_portal('[data-left-sidebar]');
</script>

<script lang="ts">
	import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentEntryList } from '$components/entries/store';
	import Button from '$components/ui/Button.svelte';
	import { make_portal } from '$lib/actions/utils';
	import { make_link } from '$lib/utils/entries';
	import { cn } from '$lib/utils/tailwind';

	import { backContext } from './[id]/store';
	import { getEntryContext } from './ctx';
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

</script>

<nav
	bind:borderBoxSize
	style:--left={$inArticle ? 0 : `${$mainNavWidth}px`}
	style:--mobile-left={$inArticle ? 0 : `${$mobileNavWidth}px`}
	class={cn(
		'h-[--nav-height] left-0 sm:left-[--mobile-left] lg:[--left] flex items-center transition-transform transform fixed  top-0 z-[51] pl-4 w-full',
		!show && 'w-min max-w-min border-b',
		$scrollingDown && '-translate-y-full',
		// $rightSidebar && 'opacity-0'
	)}
>
	<Button variant="ghost" href={$backContext}>
		<ArrowLeft />
	</Button>
	{#if currentIndex > -1 && $currentEntryList.length}
		<Button
			on:mouseover={() => {
				if (prev_link) {
					preloadData(prev_link);
				}
			}}
			on:click={() => {
				if (prev_link) {
					goto(prev_link);
				}
			}}
			disabled={!prev_link}
			variant="ghost"
		>
			<ChevronUp />
		</Button>
		<Button
			on:mouseover={() => {
				if (next_link) {
					preloadData(next_link);
				}
			}}
			on:click={() => {
				if (next_link) {
					goto(next_link);
				}
			}}
			disabled={!next_link}
			variant="ghost"
		>
			<ChevronDown />
		</Button>
		<div class="flex shrink-0">
			<span class="text-xs font-normal text-left tabular-nums"
				>{currentIndex + 1}
				<span class="text-muted-foreground">/ {$currentEntryList.length}</span
				></span
			>
		</div>
	{/if}
</nav>
{$page.data.entry?.type}
{#if $page.data.type === 'article'}
	<aside class="fixed w-72 left-0 top-0 bottom-0 pt-20" data-left-sidebar>
		<Toc />
	</aside>
{/if}
