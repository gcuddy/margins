<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '@margins/lib';
	import Nav from './nav.svelte';

	// import 'katex/dist/katex.min.css';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	// export let data;

	// Right now this is hardcoded...

	// const is_entry = writable(false);
	// setContext('is_entry', is_entry);
	// // // eslint-disable-next-line no-unused-expressions
	// // $: $page.route.id?.startsWith(`/(app2)/(listables)/[type=type]/[id]`)
	// // 	? is_entry.set(true)
	// // 	: is_entry.set(false);

	const navWidth = writable(240);
	// const mobileNavWidth = writable(81);
	setContext('mainNavWidth', navWidth);
	// setContext('mobileNavWidth', mobileNavWidth);

	// // queryclient

	// setContext('inArticle', inArticle);
	// $: $inArticle =
	// 	$page.url.pathname.startsWith('/article') ||
	// 	$page.url.pathname.startsWith('/pdf');
</script>

<div
	class="flex h-full min-h-full w-full flex-row items-stretch overflow-hidden"
>
	<!-- w-[200px] -->
	<div>
		{#if $page.url.pathname.startsWith('/settings')}
			<!-- todo -->
		{:else}
			<div style:width="{$navWidth}px" />
			<div class="fixed bottom-0 left-0 top-0 z-40" style:width="{$navWidth}px">
				<Nav bind:width={$navWidth} />
			</div>
		{/if}
		<!-- <MobileNav /> -->
	</div>
	<main
		class={cn(
			'flex h-full w-full flex-1 flex-col border-l',
			'relative',
			'col-start-2',
			// $mainClassStore,
		)}
	>
		<!-- style:padding-bottom="{$audioPlayer.height}px" -->
		<slot />
	</main>
</div>
