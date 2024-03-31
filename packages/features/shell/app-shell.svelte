<script lang="ts">
	import Nav from './nav.svelte';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import MainShell from './main-shell.svelte';
	import { tweened } from 'svelte/motion';
	import { createCtx } from './ctx.js';
	export let showSidebar = true;

	const DURATION = 125;

	const navWidthSpacer = tweened(240, {
		duration: DURATION,
	});
	const navWidth = writable(240);
	const navLeft = tweened(0, {
		duration: DURATION,
	});
	setContext('mainNavWidth', navWidth);
	const { isSidebarVisible } = createCtx();
</script>

<div
	class="flex h-full min-h-full w-full flex-row items-stretch overflow-hidden"
>
	<!-- w-[200px] -->
	<div>
		{#if showSidebar}
			<div style:width="{$navWidthSpacer}px" />
			<div
				class="fixed bottom-0 top-0 z-40"
				style:left="{$navLeft}px"
				style:width="{$navWidth}px"
			>
				<Nav
					bind:isSidebarVisible={$isSidebarVisible}
					onResize={({ width }) => {
						navWidthSpacer.set(width, {
							duration: 0,
						});
						navWidth.set(width);
					}}
					onToggleSidebar={(isSidebarVisible) => {
						// This is set to the margin left if not visible, should share a variable
						navWidthSpacer.set(isSidebarVisible ? $navWidth : 8);
						navLeft.set(isSidebarVisible ? 0 : -$navWidth);
					}}
				/>
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
