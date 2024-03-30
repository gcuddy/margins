<script lang="ts">
	import Nav from './nav.svelte';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import MainShell from './main-shell.svelte';
	export let showSidebar = true;

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
		{#if showSidebar}
			<div style:width="{$navWidth}px" />
			<div class="fixed bottom-0 left-0 top-0 z-40" style:width="{$navWidth}px">
				<Nav bind:width={$navWidth} />
			</div>
		{/if}
		<!-- <MobileNav /> -->
	</div>
	<!-- style:padding-bottom="{$audioPlayer.height}px" -->
	<div class="flex min-w-0 flex-1 flex-col">
		<MainShell>
			<slot />
		</MainShell>
	</div>
</div>

<style>
	:global(body) {
		position: fixed;
		overflow: hidden;
		width: 100%;
		height: 100%;
	}
</style>
