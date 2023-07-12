<script lang="ts">
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import type { QueryOutput } from '$lib/queries/query';
	import type { SuggestionProps } from '@tiptap/suggestion';
	import { Loader2 } from 'lucide-svelte';
	import { onMount, type ComponentType, tick } from 'svelte';
	import { createPopperActions, type ContentAction } from 'svelte-popperjs';
	import { Writable, writable } from 'svelte/store';
	import { fade, scale } from 'svelte/transition';

	type $$Props = {
		items: QueryOutput<'searchNotes'>;
		loading: Writable<boolean>;
	} & SuggestionProps;

	export let items: QueryOutput<'searchNotes'> = [];
	export let command: any;
	export let query = '';
	export let loading: $$Props['loading'];

	export let clientRect: $$Props['clientRect'] = undefined;

	const [ref, content] = createPopperActions({
		strategy: 'fixed',
		placement: 'bottom-start'
	});

	ref({
		getBoundingClientRect: () => {
			let rect = clientRect && clientRect();
			if (rect) return rect;
			return {
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: 0,
				height: 0,
				x: 0,
				y: 0,
				toJSON: () => {}
			};
		}
	});

	let commandListContainer: HTMLDivElement;

	let selectedIndex = writable(0);

	const selectItem = (index: number) => {
		const item = items[index];
		if (item) {
			command(item);
		}
	};
	const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];

	$: items.length, selectedIndex.set(0);

	// TODO: Updatescrollview?
	$: if (commandListContainer) {
		// tick().then()
		// commandListContainer.scrollTop = 0;
	}

	function sync_scroll() {
		tick().then(() => {
			const el = commandListContainer.querySelector(`[data-index="${$selectedIndex}"]`);
			if (el) {
				el.scrollIntoView({
					block: 'nearest',
					inline: 'nearest'
				});
			}
		});
	}
	$: console.log({ $$props });

	// export let decorationNode: HTMLElement;

	// $: if (!query) {
	// 	console.log({decorationNode})
	// 	decorationNode?.classList.add('is-empty')
	// } else {
	// 	decorationNode?.classList.remove('is-empty')
	// }

	let animate = false;
	onMount(() => {
		// very ugly hack
		animate = true;
	});
</script>

<svelte:window
	on:keydown={(e) => {
		if (navigationKeys.includes(e.key)) {
			e.preventDefault();
			if (e.key === 'ArrowUp') {
				selectedIndex.set(($selectedIndex + items.length - 1) % items.length);
				sync_scroll();
				return true;
			}
			if (e.key === 'ArrowDown') {
				selectedIndex.set(($selectedIndex + 1) % items.length);
				sync_scroll();
				return true;
			}
			if (e.key === 'Enter') {
				selectItem($selectedIndex);
				return true;
			}
			return false;
		}
	}}
/>
{#if animate}
	<div
		transition:fade={{
			duration: 200
		}}
		use:content
	>
		<div
			id="slash-command"
			bind:this={commandListContainer}
			class="z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border bg-popover px-1 py-2 shadow-md transition-all"
		>
			<span class="text-muted-foregorund mb-2 flex items-center gap-x-2 text-sm">
				Search for a page
				{#if $loading}
					<Loader2 class="h-4 w-4 animate-spin" />
				{/if}
			</span>
			{#if items.length > 0}
				{#each items as item, index}
					<button
						data-index={index}
						class={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-popover-foreground hover:bg-accent ${
							index === $selectedIndex ? 'bg-accent text-accent-foreground' : ''
						}`}
						on:click={() => selectItem(index)}
					>
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background"
						>
							<img src={item.entry?.image} class="h-6 w-6 rounded-md" />
						</div>
						<div>
							<p class="line-clamp-2 font-medium">{item.body || item.exact || item.title}</p>
							<p class="line-clamp-2 text-xs text-muted-foreground">{item.entry?.title}</p>
						</div>
					</button>
				{/each}
			{:else if !$loading}
				<div class="flex items-center justify-center text-muted-foreground">No results found</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	:global(.bookmark-suggester.is-empty::after) {
		content: 'Search for a bookmark…';
		@apply text-muted-foreground;
	}
</style>
