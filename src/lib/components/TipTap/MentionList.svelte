<script lang="ts" context="module">
	// const stores = (items: string[]) => {
	// 	const {subscribe, set, update} = writable({
	// 		index: 0,
	// 		items,
	// 	});
	// 	// const items = writable(_items);
	// 	// forward event
	// 	const onKeydown = (e: KeyboardEvent) => {
	// 		if (e.key === "ArrowUp") {
	// 			update(({index, items}) => {
	//                 index = (index + items.length - 1) % items.length;
	//                 return {index, items};
	//             })
	// 		}
	// 		if (e.key === "ArrowDown") {
	// 			update(({index, items}) => {
	//                 index = (index + 1) % items.length;
	//                 return {index, items};
	//             })
	// 		}
	//         if (e.key === "Enter") {
	// 			enterHandler();
	// 		}
	// 	};
	// 	const enterHandler = () => {
	// 		selectItem(selectedIndex);
	// 	};

	// 	$: items, (selectedIndex = 0);

	// 	function handleKeydown(e: KeyboardEvent) {
	// 		if (e.key === "ArrowUp") {
	// 			upHandler();
	// 		}

	// 		if (e.key === "ArrowDown") {
	// 			downHandler();
	// 		}

	// 		if (e.key === "Enter") {
	// 			enterHandler();
	// 		}
	// 	}

	// 	return {
	// 		itemStore,
	// 		items,
	// 		index,
	// 		dispatch: (type: "onKeydown", event: KeyboardEvent) => {
	// 			if (type === "onKeydown") {
	// 				onKeydown(event);
	// 			}
	// 		},
	// 	};
	// };
	import type { SuggestionProps } from "@tiptap/suggestion";

	export type State = {
		index: number;
		items: {
			id: string | number;
			label: string;
			type?: DocumentType;
		}[];
		props?: SuggestionProps;
	};

	export const createMentionListState = () => {
		const store = writable<State>({
			index: 0,
			items: [],
		});
		const up = () => {
			store.update((state) => {
				return {
					...state,
					index: (state.index + state.items.length - 1) % state.items.length,
				};
			});
		};
		const down = () => {
			store.update((state) => {
				return {
					...state,
					index: (state.index + 1) % state.items.length,
				};
			});
		};
		const setItems = (items: { id: string | number; label: string }[]) => {
			store.update((state) => {
				return {
					...state,
					items,
					index: 0,
				};
			});
		};
		const selectItem = (idx?: number) => {
			const { index, items, props } = get(store);
			const item = items[idx ?? index];
			if (item) {
				props?.command(item);
			}
		};
		const setProps = (props: any) => {
			store.update((state) => {
				return {
					...state,
					props,
				};
			});
		};
		return {
			...store,
			up,
			down,
			setItems,
			setProps,
			selectItem,
		};
	};
</script>

<script lang="ts">
	import { createPopperActions } from "svelte-popperjs";
	import { get, Readable, Writable, writable } from "svelte/store";
	import { getContext, tick } from "svelte";
	import { onDestroy } from "svelte";
	import type { DocumentType } from "@prisma/client";

	export let state: Writable<State>;
	export let items: State["items"];
	// export let contentRect: DOMRect;
	export let clientRect: SuggestionProps["clientRect"] | undefined = undefined;

	$: rect = clientRect && clientRect();
	const [ref, content] = createPopperActions({
		strategy: "fixed",
		placement: "bottom-start",
	});

	const virtualElement = writable({
		getBoundingClientRect: clientRect,
	});

	$: $virtualElement = {
		getBoundingClientRect: clientRect,
	};
	ref({
		getBoundingClientRect: () =>
			rect || { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0 },
	});
	export let command: (command: { id: string | number; label: string; type?: DocumentType }) => void;

	interface $$Props extends SuggestionProps {
		state: Writable<State>;
	}

	let selectedIndex: number = 0;

	const selectItem = (index: number) => {
		const item = items[index];
		if (item) {
			command(item);
		}
	};

	const upHandler = () => {
		selectedIndex = (selectedIndex + items.length - 1) % items.length;
	};

	const downHandler = () => {
		selectedIndex = (selectedIndex + 1) % items.length;
	};

	const enterHandler = () => {
		selectItem(selectedIndex);
	};

	$: items, (selectedIndex = 0);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "ArrowUp") {
			upHandler();
		}

		if (e.key === "ArrowDown") {
			downHandler();
		}

		if (e.key === "Enter") {
			enterHandler();
		}
	}
	// scroll active item into view
	export let container: HTMLElement | undefined = undefined;

	const unsubscribe = state.subscribe((state) => {
		if (container) {
			const active = container.querySelector(`[data-index="${state.index}"]`);
			console.log(state.index, active);
			active?.scrollIntoView({ block: "nearest" });
		}
	});
	onDestroy(() => {
		unsubscribe();
	});
	// $: if (container) {
	//     const active = container.querySelector(".active");
	// 	console.log($state.index, active);
	//     tick().then(() => {

	//     })
	// 	if (active) {
	// 		active.scrollIntoView({ block: "nearest" });
	// 		console.log({ active });
	// 	}
	// }
</script>

<!-- <svelte:window on:keydown={handleKeydown} /> -->
<div
	bind:this={container}
	class="items z-[600] flex max-h-48 w-auto min-w-[250px] max-w-[75vh] grow flex-col overflow-y-auto rounded bg-elevation text-sm shadow-md scrollbar-hide "
	use:content
>
	{#if items?.length}
		{#each $state.items || [] as item, index (index)}
			<button
				data-index={index}
				class:active={index === $state.index}
				class="flex h-8 shrink-0 items-center justify-between gap-2 truncate bg-transparent px-2 text-sm"
				on:click={() => selectItem(index)}
				on:mouseover={() => ($state.index = index)}
			>
				<!-- TODO: display either progress or state  -->
				<!-- {item.type} -->
                {JSON.stringify(item)}
				<!-- {item.label} -->
			</button>
		{/each}
	{:else}
		<div>No result</div>
	{/if}
</div>

<style lang="postcss">
	.active {
		@apply bg-elevation-hover;
	}
</style>
