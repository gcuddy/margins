<script lang="ts">
	import type { SuggestionProps } from '@tiptap/suggestion';
	import { onMount, tick } from 'svelte';
	import { createPopperActions } from 'svelte-popperjs';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	type T = $$Generic;

	export let items: T[] = [];
	export let command: any = () => {};
	export let loading = writable(false);
	export let clientRect: SuggestionProps['clientRect'] = undefined;

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
		transition:fade|global={{
			duration: 200
		}}
		use:content
	>
		<div
			id="slash-command"
			bind:this={commandListContainer}
			class="z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border bg-popover px-1 py-2 shadow-md transition-all flex flex-col"
		>
			<slot name="outer" loading={$loading} {items} selectedIndex={$selectedIndex}>
				{#each items as item, index}
					<button
						data-index={index}
						class={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-popover-foreground hover:bg-accent ${
							index === $selectedIndex ? 'bg-accent text-accent-foreground' : ''
						}`}
						on:click={() => selectItem(index)}
					>
						<slot {item} {index} />
					</button>
				{:else}
					<slot name="empty">
                        No match
                    </slot>
				{/each}
			</slot>
		</div>
	</div>
{/if}

<style lang="postcss">
	:global(.bookmark-suggester.is-empty::after) {
		content: 'Search for a bookmark…';
		@apply text-muted-foreground;
	}
</style>
