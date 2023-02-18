<script lang="ts">
	import type { FilterModel } from "$lib/stores/filter";
	import type { Placement } from "@popperjs/core";
	import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from "@rgossiaux/svelte-headlessui";
	import { ComponentProps, ComponentType, getContext } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import type { Writable } from "svelte/store";
	import { fade } from "svelte/transition";
	import Button from "../Button.svelte";
	import Icon from "../helpers/Icon.svelte";
	import type { ChildOption } from "./SimpleFilter.svelte";
	import SimpleFilter from "./SimpleFilter.svelte";

	type T = $$Generic;

	export let filters: Writable<FilterModel<T>[]>;
	export let placement: Placement = "bottom-start";
	let c = "relative";
	export { c as class };
	if (!filters) {
		// get from context
		getContext("filter");
	}

	interface $$Props extends Omit<ComponentProps<SimpleFilter<T>>, "chosenFilters"> {
		filters: Writable<FilterModel<T>[]>;
		placement?: Placement;
		class?: string;
	}

	let buttonRef: HTMLElement;
	const [popperRef, popperContent] = createPopperActions({
		placement,
		strategy: "absolute",
	});
</script>

<Popover class={c} let:open let:close>
	<PopoverButton as="div" class="flex h-full items-center">
		<div bind:this={buttonRef} use:popperRef class="flex h-full max-w-min items-center">
			<slot>
				<Button
					variant="dashed"
					className="space-x-1 text-sm"
					tooltip={{
						text: "Filter",
						kbd: "f",
					}}
				>
					{#if !$filters.length}
						<Icon name="plusSmSolid" className="h-4 w-4 dark:fill-gray-300" /> <span>Filter</span>
					{:else}
						<Icon name="xMarkMini" className="h-4 w-4 dark:fill-gray-300" /> <span>Clear Filters</span>
					{/if}
				</Button></slot
			>
		</div>
	</PopoverButton>
	<PopoverPanel use={[popperContent]} class="z-20">
		<div>
			<SimpleFilter
				on:select={(e) => {
					if (!e.detail.multiple) close(null);
				}}
				bind:chosenFilters={$filters}
				{...$$restProps}
			/>
		</div>
	</PopoverPanel>
</Popover>
