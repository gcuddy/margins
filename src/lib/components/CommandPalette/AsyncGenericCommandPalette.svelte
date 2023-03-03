<script lang="ts">
	const dispatch = createEventDispatcher<{
		select: TValue;
	}>();
	type TValue = $$Generic;

	export let query: (term: string) => CreateQueryOptions<TValue[]>;

	export let slot: ComponentType | null = null;

	$: Query = createQuery({ ...query($term) });
	//todo: export function to search value (for derived store)

	/** Fallback shows when nothing else is found. */
	export let fallback: ((input: string) => TValue) | undefined = undefined;

	// We pass the page store as well
	export let onSelect = (e: CustomEvent<TValue>, page: Page) => {
		dispatch("select", e.detail);
	};

	// this can be disabled if you want to handle it yourself
	export let closeOnSelect = true;
	// TODO: expand on this open to be more like stacking modals
	export let open = true;

	// optional Raw html or StoredComponent to display per item
	export let itemDisplay:
		| ((value: TValue, active: boolean, selected: boolean, index: number) => string | StoredComponent)
		| null = null;

	// optionally set an icon ot display for each item, using a stored component
	export let itemIcon:
		| (<T extends { $set: (...args: any) => any }>(
				value: TValue,
				active: boolean,
				selected: boolean,
				index: number
		  ) => {
				component: T;
				props: ComponentProperties<T>;
		  })
		| null = null;

	// optionally, return a string to prefetch when that item is active (for performance but more network requests)
	let prefetchProp: ((value: TValue) => string) | null = null;
	export { prefetchProp as prefetch };

	/** STORE SETUP (maybe put in sep file or module) **/
	export let term = writable("");

	import Combobox from "../helpers/Combobox.svelte";
	import { fadeScale } from "$lib/transitions";
	import { derived, writable, type Readable, type Writable } from "svelte/store";
	import {
		ComponentProps,
		ComponentType,
		createEventDispatcher,
		onDestroy,
		onMount,
		SvelteComponent,
	} from "svelte";
	import type {
		ComponentProperties,
		StoredComponent,
		StoredComponentTyped,
		SvelteComponentWithProps,
	} from "$lib/stores/types";
	import { preloadData } from "$app/navigation";
	import type { IconName } from "$lib/icons";
	import Icon from "../helpers/Icon.svelte";
	import type { Maybe } from "@trpc/server";
	import { chosenIcon, type ChosenIcon } from "$lib/types/icon";
	import { page } from "$app/stores";
	import type { Page } from "@sveltejs/kit";
	import ChosenIconComponent from "../ChosenIcon.svelte";
	import { createQuery, CreateQueryOptions, CreateQueryResult } from "@tanstack/svelte-query";

	function commandListener({ detail: e }: CustomEvent<KeyboardEvent>) {
		if (e.key === "Escape") {
			open = false;
		}
	}

	export let placeholder: string = "Search…";
</script>

<div transition:fadeScale={{ duration: 150, baseScale: 0.95 }}>
	<!-- TODO: make onselect a prop -->
	<Combobox
		values={Query && $Query?.isSuccess ? $Query.data : $filteredActions || []}
		bind:value={$term}
		fillValue={false}
		animateHeight={true}
		on:select={(e) => {
			console.log({ e });
			onSelect(e, $page);
			if (closeOnSelect) {
				console.log("closing");
				open = false;
			}
		}}
		on:keydown={commandListener}
		on:active={(e) => {
			// if (prefetchProp) {
			// 	preloadData(prefetchProp(e.detail));
			// }
		}}
		input={{
			class:
				"w-full bg-transparent text-lg border-0 focus:ring-0 text-gray-800 dark:text-gray-100 placeholder-gray-400  p-5",
			placeholder,
		}}
		options={{
			class: `max-h-96 text-sm overflow-y-auto ${!Query || !$Query?.data?.length ? "hidden" : ""}`,
		}}
		static={true}
		expanded={true}
		class="relative mx-auto max-w-2xl divide-y divide-gray-100 overflow-hidden rounded-xl bg-gray-50 text-gray-900 shadow-2xl ring-1 ring-black/5 dark:divide-gray-600 dark:bg-gray-800 dark:bg-gradient-to-br dark:from-gray-700 dark:to-gray-800 dark:text-gray-100 dark:ring-black/25"
	>
		<div slot="option" let:value let:active let:selected let:index>
			<slot {value} {active} {selected} {index}>
				<div
					class="relative text-gray-600 dark:text-gray-300 {active
						? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:!text-white'
						: ''} flex h-12 w-full items-center gap-3.5 px-4 py-2"
				>
					{#if slot}
						<svelte:component this={slot} {value} {active} {selected} {index} />
					{:else}
						<slot name="value" {value} {active} {selected} {index} />
					{/if}
				</div>
			</slot>
		</div>
	</Combobox>
</div>
