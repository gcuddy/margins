<script lang="ts">
	import { persisted } from 'svelte-local-storage-store';
	import ColResizer from '$components/ColResizer.svelte';
	import EntryMobileSidebar from '$components/entries/entry-mobile-sidebar.svelte';
	import EntrySidebar from '$components/entries/entry-sidebar.svelte';
	import mq from '$lib/stores/mq';
	import { check_inert, check_inside_input } from '$lib/utils';
	import { getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	export let render: Writable<boolean> = getContext('rightSidebar') ?? writable(false);

	$: console.log({ $render });
	const width_store =
		(getContext('rightSidebarWidth') as Writable<number>) ?? persisted('sidebar__width', 360);

	export let width = $width_store || 360;

	let container: HTMLElement;

	function on_keydown(e: KeyboardEvent) {
		if (container && check_inert(container)) return;
		console.log({ e });
		if (e.target instanceof Element && check_inside_input(e.target)) return;
		if (e.key === 'i' && e.metaKey) {
			e.preventDefault();
			$render = !$render;
		}
	}
</script>

<svelte:window on:keydown={on_keydown} />
{#if $render}
	<div
		bind:this={container}
		transition:fly={{ x: $width_store, duration: 300, opacity: 1 }}
		class="fixed hidden md:block right-0 top-0 h-screen transition-transform duration-300 md:w-[--right-sidebar-width] border-l bg-background"
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
<EntryMobileSidebar defaultOpen={$render} let:open>
	<EntrySidebar on:click={() => open.set(false)} />
</EntryMobileSidebar>
{#if $mq.md}{:else}{/if}
