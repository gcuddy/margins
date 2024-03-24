<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import { createEventDispatcher, tick } from 'svelte';
	import { SELECT_EVENT, useState } from '../cmdk/Command.Root.svelte';

	let className = '';
	export { className as class };
	export let onSelect: ((value: string) => void) | undefined = undefined;

	const state = useState();
	const dispatch = createEventDispatcher<{
		select: string;
	}>();

	let render = false;

	$: tick().then(() => {
		render = $state.filtered.count === 0;
	});

	$: console.log({ render });

	function handle_select() {
		dispatch('select', $state.search);
		onSelect?.($state.search);

		state.close();
	}

	function mount(el: HTMLElement) {
		el.addEventListener(SELECT_EVENT, handle_select);
		return {
			destroy() {
				el.removeEventListener(SELECT_EVENT, handle_select);
			}
		};
	}
</script>

<!-- Important: this shuold be rendered *instead* of the command.empty -->
{#if render}
	<!-- fake "group" -->
	<div class="p-1">
		<div
			use:mount
			role="option"
			aria-selected="true"
			data-active="true"
			data-cmdk-item
			class={cn(
				'relative flex cursor-default select-none items-center rounded-sm bg-accent px-2 py-1.5 text-sm text-accent-foreground outline-none ',
				className
			)}
		>
			<slot search={$state.search} />
		</div>
	</div>
{/if}
