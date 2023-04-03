<script lang="ts">
	import { browser } from "$app/environment";
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import { checkIfKeyboardShortcutsAllowed } from "$lib/stores/keyboard";
	import {
		createVirtualizer,
		createWindowVirtualizer,
	} from "@tanstack/svelte-virtual";
	import { createEventDispatcher, onMount } from "svelte";
	import { match, P } from "ts-pattern";
	export let ref: HTMLElement | null = null;

	type V = Parameters<typeof createVirtualizer>[0];
	type RequireKeys<T extends object, K extends keyof T> = Required<Pick<T, K>> &
		Omit<T, K>;
	const dispatch = createEventDispatcher<{
		end: null;
		enter: {
			ref: HTMLElement | null;
			index: number;
		};
	}>();
	const defaultOpts: Omit<V, "count"> = {
		overscan: 5,
		getScrollElement: () => ref,
		estimateSize: () => 40,
		// debug: true,
		initialRect: {
			height: 800,
			width: 100,
		},
	};
	export let height: number;
	export let opts: RequireKeys<Partial<V>, "count" | "getItemKey">;

	let v = createVirtualizer({
		...defaultOpts,
		...opts,
	});

	// const v = createWindowVirtualizer({
	// 	count: opts.count,
	// 	estimateSize: () => 40,
	// });

	$: opts,
		$v.setOptions({
			...$v.options,
			...opts,
		});

	$: {
		if ($v) {
			const lastItem = $v.getVirtualItems().at(-1);
			if (lastItem?.index && lastItem.index >= $v.options.count - 1) {
				dispatch("end");
			}
		}
	}

	let activeIndex = -1;

	let hoveredIndex = -1;
	$: activeIndex, (hoveredIndex = activeIndex);

	function handleKeydown(e: KeyboardEvent) {
		if (!checkIfKeyboardShortcutsAllowed()) return;
		match(e.key)
			.with("j", () => {
				const elsToSearch = els.slice(activeIndex + 1);
				console.log({ elsToSearch });
				const idx = elsToSearch.findIndex((e) => e);
				console.log(idx);
				const el = elsToSearch[idx];
				console.log({ idx, el });
				if (el) {
					el.scrollIntoView({ block: "nearest" });
					activeIndex = activeIndex + 1 + idx;
				}
			})
			.with("k", () => {
				const el = els[activeIndex - 1];
				if (el) {
					el.scrollIntoView({ block: "nearest" });
					activeIndex--;
				}
			})
			.with("Enter", () => dispatch("enter", { index: activeIndex, ref }))
			.otherwise((v) => console.log(v));
	}

	$: activeIndex, {};

	afterNavigate(({ type }) => {
		if (browser && type === "popstate") {
			const scrollLookup = sessionStorage.getItem("scroll");
			if (scrollLookup) {
				console.log(`scrollLookup`);
				const lookup = JSON.parse(scrollLookup);
				let scroll = lookup[$page.url.pathname];
				if (scroll && typeof scroll === "number") {
					console.log({ scroll });
					console.log({ $v });
					v = createVirtualizer({
						...defaultOpts,
						...opts,
						initialOffset: scroll,
					});
					// $v.scrollToOffset(scroll);
				}
			}
			// scrollLookup[$page.]
		}
	});

	let els: HTMLElement[] = [];
	$: console.log({ els });

	beforeNavigate(() => {
		let scroll = $v.scrollOffset;
		if (browser && scroll) {
			const l = sessionStorage.getItem("scroll");
			const lookup = l ? JSON.parse(l) : {};
			lookup[$page.url.pathname] = scroll;
			console.log({ lookup });
			sessionStorage.setItem("scroll", JSON.stringify(lookup));
		}
		console.log({ scroll });
	});
</script>

<svelte:window on:keydown={handleKeydown} />
<div bind:this={ref} style:height="{height}px" class="grow overflow-y-auto">
	<!-- TODO -->
	{#if v}
		<div style="height: {$v.getTotalSize()}px; width: 100%; position: relative">
			{#each $v.getVirtualItems() as virtualRow, index}
				{@const isLoaderRow = virtualRow.index > $v.options.count - 1}
				<div
					bind:this={els[virtualRow.index]}
					class="flex"
					class:odd={virtualRow.index % 2}
					style="height: {virtualRow.size}px; transform: translateY({virtualRow.start}px); position: absolute; top:0; left:0; width: 100%;"
				>
					<slot
						{isLoaderRow}
						active={activeIndex === virtualRow.index}
						{virtualRow}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>
