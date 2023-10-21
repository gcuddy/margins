<script lang="ts">
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';

	import ColResizer from '$components/ColResizer.svelte';
	import EntryMobileSidebar from '$components/entries/entry-mobile-sidebar.svelte';
	import EntrySidebar from '$components/entries/entry-sidebar.svelte';
	import { check_inert, check_inside_input } from '$lib/utils';

	import { getEntryContext } from './ctx';

	const { rightSidebar, rightSidebarWidth } = getEntryContext();
	export let render = rightSidebar;

	const width_store = rightSidebarWidth;

	let container: HTMLElement | null = null;

	function on_keydown(e: KeyboardEvent) {
		if (container && check_inert(container)) {return;}
		if (e.target instanceof Element && check_inside_input(e.target)) {return;}
		if (e.key === 'i' && e.metaKey) {
			e.preventDefault();
			$render = !$render;
		}
	}

	const mobileSidebarOpen = writable(false);
</script>

<svelte:window on:keydown={on_keydown} />
{#if $render}
	<div
		bind:this={container}
		transition:fly={{ duration: 300, opacity: 1, x: $width_store }}
		class="fixed hidden lg:block right-0 top-0 h-screen transition-transform duration-300 md:w-[--right-sidebar-width] border-l bg-background"
	>
		<EntrySidebar />

		<!-- Resizer -->
		<ColResizer
			min={300}
			max={550}
			direction="w"
			class="absolute -left-1 bottom-0 top-0 z-50 w-2 cursor-col-resize after:absolute after:inset-y-0 after:left-0.5 after:w-0.5 "
			bind:width={$width_store}
		/>
	</div>
{/if}
<EntryMobileSidebar open={mobileSidebarOpen} defaultOpen={$render}>
	<EntrySidebar
		on:click={() => {
			mobileSidebarOpen.set(false);
		}}
	/>
</EntryMobileSidebar>
