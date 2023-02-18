<script lang="ts">
	import Button from "$lib/components/Button.svelte";

	import Icon from "$lib/components/helpers/Icon.svelte";

	import type { Placement } from "@popperjs/core";
	import { Popover, PopoverButton, PopoverPanel } from "@rgossiaux/svelte-headlessui";
	import { createPopperActions } from "svelte-popperjs";
	import EntryFilterCondition from "./EntryFilterCondition.svelte";
	import { ChosenCondition, getFilterContext } from "./EntryFilter.svelte";
	import { checkIfKeyboardShortcutsAllowed } from "$lib/stores/keyboard";

	type T = $$Generic;

	export let placement: Placement = "bottom-start";

	let buttonRef: HTMLElement;
	const [popperRef, popperContent] = createPopperActions({
		placement,
		strategy: "absolute",
	});

	let filter_open = false;

	let button: HTMLButtonElement;

	// export let chosenConditions: ChosenCondition[] = [];
	// export let index: number;

	const store = getFilterContext();

	export let slim = false;
</script>

<svelte:window on:keydown={(event) => {
	if (!checkIfKeyboardShortcutsAllowed()) return;
	// if f key pressed, open filters
	if (event.key === "f") {
		event.preventDefault()
		filter_open = true;
	}
}}/>

<Popover class="relative" let:open let:close>
	<PopoverButton on:keydown={(e) => {
		// if key is space or enter, open
		if (e.key === " " || e.key === "Enter") {
			filter_open = true;
		}
	}} on:click={() => (filter_open = true)} class="flex h-full items-center">
		<div bind:this={buttonRef} use:popperRef class="flex h-full max-w-min items-center">
			<slot>
				<Button
					as="div"
					bind:el={button}
					variant={slim ? "naked" : "dashed"}
					className="space-x-1 text-sm"
					tooltip={{
						text: "Filter",
						kbd: "f",
					}}
				>
					<Icon name="plusSmSolid" className="h-4 w-4 fill-muted" />{#if !slim}
						<span>Filter</span>{/if}
				</Button></slot
			>
		</div>
	</PopoverButton>
	{#if filter_open}
		<PopoverPanel use={[popperContent]} class="z-40" static>
			<div>
				<!-- bind:chosenCondition -->
				<EntryFilterCondition
					on:close={() => {
						close(button);
						filter_open = false;
					}}
					on:save={({ detail }) => {
						store.add(detail);
					}}
				/>
			</div>
		</PopoverPanel>
	{/if}
</Popover>
