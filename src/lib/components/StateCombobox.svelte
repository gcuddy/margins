<script lang="ts">
	import { page } from "$app/stores";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import mq from "$lib/stores/mq";
	import type { Tooltip } from "$lib/stores/Tooltips";
	import { LOCATION_TO_ICON_SOLID } from "$lib/types/schemas/Locations";
	import type { State } from "@prisma/client";
	import {
		Popover,
		PopoverButton,
		PopoverPanel,
	} from "@rgossiaux/svelte-headlessui";
	import { createPopperActions } from "svelte-popperjs";
	import { tweened } from "svelte/motion";
	import GenericCombobox from "./GenericCombobox.svelte";

	export let state = $page.data.user?.states?.find(
		(s) => s.id === $page.data.user?.default_state_id
	);
	export let unsaved = false;
	export let buttonWrapper: HTMLDivElement | undefined = undefined;
	$: console.log({ state, $page });
	$: name = state?.name;
	$: location = state?.type;
	export let states = $page.data.user?.states || [];

	export let label = true;
	export let includeIcon = true;
	let className = "";
	export { className as class };
	export let size: "xs" | "sm" | "base" = "sm";
	export let tooltip: Tooltip | undefined = undefined;
	export let onSelect: ((state: State) => void) | undefined = undefined;

	const [popperRef, popperContent] = createPopperActions();

	// Example Popper configuration
	const popperOptions = {
		placement: "bottom-start",
		strategy: "fixed",
		// modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
	};

	$: console.log({ location, states });

	let combobox: HTMLElement;

	$: console.log({ $mq });

	let isOpen = false;

	// REVIEW: instead of passing stores down the component ladder, would context be better suited for this?

	let height = tweened(200, {
		duration: 125,
	});
</script>

<!-- <GenericCombobox /> -->

<!-- TODO: progressive enhancement version (simple select and go) -->
<Popover --height={$height}>
	<input type="hidden" name="state" value={state.id} />
	<div bind:this={buttonWrapper} class="button-wrapper">
		<PopoverButton
			class="relative flex cursor-default items-center gap-1 rounded py-1 px-2 text-left transition focus-visible:bg-gray-200 focus-visible:ring-2 hover:bg-gray-200   dark:focus-visible:bg-gray-700 dark:focus-visible:ring-offset-stone-900 dark:hover:bg-gray-700"
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			use={[popperRef]}
		>
			{#if unsaved}
				unsaved
			{:else}
				{#if includeIcon}
					<Icon
						name={LOCATION_TO_ICON_SOLID[location]}
						className="h-4 w-4 fill-gray-600 dark:fill-gray-500"
					/>
				{/if}
				{#if label}
					<SmallPlus {size}>{name}</SmallPlus>{/if}
			{/if}
		</PopoverButton>
	</div>
	<PopoverPanel
		let:close
		class="z-50 h-[calc(var(--height)*1px)] text-sm"
		use={[[popperContent, popperOptions]]}
	>
		<GenericCombobox
			bind:ref={combobox}
			bind:height
			static
			autofocus
			values={states}
			placeholder="Change status…"
			selectedValue={[state]}
			onSelect={async (e) => {
				console.log({ e });
				state = e;
				// close
				close(null);
				if (onSelect) {
					onSelect(e);
				}
			}}
			let:value
			let:selected
			let:active
		>
			<div class="flex h-8 items-center gap-2 px-2 text-sm">
				<Icon
					className="h-4 w-4 {active ? 'fill-bright' : 'fill-muted/80'}"
					name={LOCATION_TO_ICON_SOLID[value.type]}
				/>

				<span class="grow {active ? 'text-bright' : 'text-muted/80'}"
					>{value.name}</span
				>
				{#if selected}
					<Icon name="checkMini" className="h-4 w-4 fill-gray-400" />
				{/if}
			</div>
		</GenericCombobox>
	</PopoverPanel>
</Popover>
<noscript>
	<!-- select menu here (and don't render above) -->
</noscript>
