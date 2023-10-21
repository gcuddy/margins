<!-- TODO: https://github.com/sveltejs/site-kit/blob/master/packages/site-kit/src/lib/search/SearchResultList.svelte -->
<script lang="ts">
	import Input from '../Input.svelte';
	import { query, searching } from './stores';

	/**
	 * Items can be flat array, array of groups, or an object/map of groups
	 */
	type Items<T> = T[] | T[][] | Record<string, T[]> | Map<string, T[]>;

	type T = $$Generic;

	// TODO: accept async function
	export let items: T[] = [];
	export let filter: ((search: string, item: T) => boolean) | undefined = undefined;

	// use a handler in case we want to add a debounce or something later
	function handle_input(e: Event) {
		$query = (e.currentTarget as HTMLInputElement).value;
	}

	let filtered_items: T[] = [];

	async function filter_items() {
		if (filter) {
			filtered_items = items.filter((item) => filter?.($query, item));
		} else {
			filtered_items = items;
		}
	}

	$: $query, filter_items();

	let wrapper: HTMLElement;

	function move(direction: 'up' | 'down') {
		const nodes = Array.from(wrapper.querySelectorAll('[data-command-item]'));
		// find index of aria-selected
		const index = nodes.findIndex((node) => node.getAttribute('aria-selected') === 'true');
		const reordered = [...nodes.slice(index + 1), ...nodes.slice(0, index + 1)];
		console.log({reordered, index})
		if (direction === 'up') {
			// go to previous
			for (let i = reordered.length - 1; i >= 0; i-=1) {
				const node = reordered[i];
				if (node.getAttribute('aria-selected') === 'true') {
					node.setAttribute('aria-selected', 'false');
					reordered[i - 1].setAttribute('aria-selected', 'true');
					return;
					break;
				}
			}

		} else {
			// go to next
			if (index === -1) {
				reordered[0].setAttribute('aria-selected', 'true');
				return;
			}
			nodes[index].setAttribute('aria-selected', 'false');
			nodes[
				Math.min(index + 1, nodes.length - 1)
			].setAttribute('aria-selected', 'true');
		}

	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'k' && (navigator.platform === 'MacIntel' ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
			$query = '';

			if ($searching) {
				close();
			} else {
				$searching = true;
			}
		}

		if (e.code === 'Escape') {
			close();
		}
	}}
/>
<div bind:this={wrapper} on:keydown={(e) => {
	// arrow down
	if (e.key === 'ArrowDown') {
		console.log('down')
		e.preventDefault();	
		move('down');
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();	
		move('up');
	}
}} class='border rounded-md p-4'>
	{$query}
	<Input
	class="placeholder:text-foreground-muted flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 border-none"
		autofocus
		value={$query}
		on:keydown={(e) => {
			if (e.key === 'Enter' && !e.isComposing) {
				// select
			}
		}}
		placeholder="Search..."
		on:input={handle_input}
	/>
	<!-- results container -->
	<div>
		<ul>
			{#each filtered_items as item}
				<li data-command-item class="aria-selected:bg-red-400">
					<slot name="item" {item} />
				</li>
			{/each}
		</ul>
	</div>
</div>
