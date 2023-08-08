<script context="module" lang="ts">
	export const leftSidebarPortal = make_portal('[data-left-sidebar]');
</script>

<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import { make_portal } from '$lib/actions/utils';
	import mq from '$lib/stores/mq';
	import { cn } from '$lib/utils/tailwind';
	import { ArrowLeft } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { backContext } from './[id]/store';

	export let show = false;

	const scrollingDown = getContext('scrollingDown') as Writable<boolean>;
	const rightSidebar = getContext('rightSidebar') as Writable<boolean>;
	const navWidth = getContext('navWidth') as Writable<number>;

	let borderBoxSize: Array<{ blockSize: number; inlineSize: number }> | undefined | null;
	$: if (borderBoxSize) $navWidth = $navWidth = borderBoxSize[borderBoxSize.length - 1]?.inlineSize;

    const inArticle = getContext('inArticle') as Writable<boolean>;
    const mainNavWidth = getContext('mainNavWidth') as Writable<number>;
</script>

<nav
	bind:borderBoxSize
    style:left={$inArticle ? 0 : $mainNavWidth + 'px'}
	class={cn(
		'h-[--nav-height] flex items-center transition-transform transform fixed  top-0 z-[51] pl-4 w-full',
		!show && 'w-min max-w-min border-b',
		$scrollingDown && '-translate-y-full',
		// $rightSidebar && 'opacity-0'
	)}
>
	<Button variant="ghost" as="a" href={$backContext}>
		<ArrowLeft />
	</Button>
</nav>
<aside data-left-sidebar>
	<!--  -->
</aside>
