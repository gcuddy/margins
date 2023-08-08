<script lang="ts">
	import { page } from '$app/stores';
	import { getPdfStateContext } from '$components/pdf-viewer/utils';
	import Button from '$components/ui/Button.svelte';
	import mq from '$lib/stores/mq';
	import { cn } from '$lib/utils/tailwind';
	import { InfoIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { derived, writable, type Writable } from 'svelte/store';
	import EntryOperations from './[id]/EntryOperations.svelte';
	import EntrySidebarButton from '$components/entries/entry-sidebar-button.svelte';

	export let scrollingDown = (getContext('scrollingDown') as Writable<boolean>) || writable(false);

	$: hide = $scrollingDown;

	$: console.log({ $scrollingDown });

	const rightSidebar = getContext('rightSidebar') as Writable<boolean>;
	const jumping = getContext('jumping') as Writable<boolean>;

	const shouldHide = derived([scrollingDown, mq], ([$scrollingDown, $mq]) => {
		return $scrollingDown || ($mq.max_md && $rightSidebar);
	});

	const pdf_state = getPdfStateContext();
	$: opts = $pdf_state.opts;

	const navWidth = getContext('navWidth') as Writable<number>;

	const mainNavWidth = getContext('mainNavWidth') as Writable<number>;
        const inArticle = getContext('inArticle') as Writable<boolean>;


	// TODO: await tick after navigating before listening to scrollingDown
</script>

<!--  -->
<!-- TODO: Hidden Header for showing on hover -->

{#if $scrollingDown}
	<div
		class="fixed flex items-center justify-between left-0 top-0 h-[--nav-height] bg-transparent {$rightSidebar
			? 'w-full md:w-[calc(100%-var(--right-sidebar-width))]'
			: 'w-full'}"
		on:mouseenter={() => ($scrollingDown = false)}
	/>
{/if}

<div
    style:--main-nav-width={$inArticle ? `0px` : $mainNavWidth + 'px'}
    style:left={$inArticle ? undefined : $mainNavWidth + 'px'}
	class={cn(
		'fixed flex items-center justify-between z-50 left-0 top-0 h-[--nav-height] border-b bg-background transition-transform duration-200 ease-in-out transform',
		$scrollingDown && '-translate-y-full',
		$rightSidebar
			? 'w-full pr-14 md:pr-0 md:w-[calc(100%-var(--right-sidebar-width)-var(--main-nav-width))]'
			: 'w-full pr-14' // pr-14 because button is w-10 r-4
		// $rightSidebar && $mq.max_md && 'opacity-0'
	)}
>
	<div class="flex items-start justify-start w-full relative px-4">
		<div class="left" style:padding-left="{$navWidth}px">
			{#if $page.data?.entry?.type === 'pdf'}
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
		<div class="right">
			<EntryOperations entry={$page.data.entry} data={$page.data.annotationForm} />
		</div>
	</div>
</div>
<!-- Floating Sidebar button (can't put in right because want it to show ) -->

<EntrySidebarButton open={rightSidebar} class="hidden md:flex" />
