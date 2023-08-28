<script context="module" lang="ts">
	export const leftSidebarPortal = make_portal('[data-left-sidebar]');
</script>

<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	import Button from '$components/ui/Button.svelte';
	import { make_portal } from '$lib/actions/utils';
	import { cn } from '$lib/utils/tailwind';

	import { backContext } from './[id]/store';
	import { getEntryContext } from './ctx';

	export let show = false;

	const { scrollingDown } = getEntryContext();

	const { navWidth } = getEntryContext();

	let borderBoxSize:
		| Array<{ blockSize: number; inlineSize: number }>
		| undefined
		| null;
	$: if (borderBoxSize) {
		const newWidth = borderBoxSize[borderBoxSize.length - 1]?.inlineSize;
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
</nav>
<aside data-left-sidebar>
	<!--  -->
</aside>
