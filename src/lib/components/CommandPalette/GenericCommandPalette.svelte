<script lang="ts">
	const dispatch = createEventDispatcher<{
		select: TValue;
	}>();
	type TValue = $$Generic<{
		id: string | number;
		name?: string;
		title?: string;
		check?: () => boolean;
		keywords?: string;
		kbd?: string[][];
		icon?: Maybe<IconName> | ChosenIcon;
		// value allows you to store extra "underlying" data
		value?: string;
	}>;

	// two different ways to handle this:
	// 1. require perform key per item
	// 2. pass on:select / onSelect with item

	// TODO: GENERIC ACTION TYPE
	// TODO: fix TValue troubles
	// allows stores to be passed in; we will read them
	export let query:
		| ((term: string) => CreateQueryOptions<TValue[]>)
		| undefined = undefined;
	export let queryResult:
		| ((term: string) => CreateQueryResult<TValue[]>)
		| undefined = undefined;
	export let values: TValue[] | Writable<TValue[]> | Readable<TValue[]> = [];

	type StoredComponent<T extends SvelteComponent> = {
		component: typeof SvelteComponent;
		// REVIEW: how come this doesn't work?
		props?: ComponentProps<T>;
	};
	export let slot:
		| (({
				value,
				active,
				index,
				selected,
		  }: {
				value: TValue;
				active: boolean;
				index: number;
				selected: boolean;
		  }) => Component)
		| null = null;

	type Component = {
		component: ComponentType;
		props?: Record<string, unknown>;
		// can't figure this out.
		// props?: ComponentProps<T>;
	};

	$: Query = query ? createQuery({ ...query($term) }) : undefined;
	//todo: export function to search value (for derived store)
	export let searchIcon = false;
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
		| ((
				value: TValue,
				active: boolean,
				selected: boolean,
				index: number
		  ) => string | StoredComponent)
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
	const commandStore = Array.isArray(values)
		? writable<TValue[]>(values)
		: values;
	$: console.log({ commandStore, $commandStore, $filteredActions });
	//TODO Use Fuse
	// TODO: fix type problems
	const filteredActions = derived([term, commandStore], ([$term, $items]) => {
		if (typeof $items[0] === "string") {
			const filteredItems = $items.filter((item) =>
				(item as unknown as string).toLowerCase().includes($term.toLowerCase())
			);
			if (filteredItems.length) {
				return filteredItems;
			}
			if (fallback && $term) {
				return [fallback($term)];
			}
			return [];
		}
		$items = $items?.filter((i) => !("check" in i) || i?.check?.());
		const filteredItems = $items?.filter((x) =>
			((x?.name || x?.title) + (x?.keywords || ""))
				.toLowerCase()
				.includes($term.toLowerCase())
		);
		if (filteredItems.length) {
			return filteredItems;
		}
		if (fallback && $term) {
			return [fallback($term)];
		}
		return [];
	});

	import Combobox from "../helpers/Combobox.svelte";
	import { fadeScale } from "$lib/transitions";
	import {
		derived,
		writable,
		type Readable,
		type Writable,
	} from "svelte/store";
	import {
		ComponentProps,
		ComponentType,
		createEventDispatcher,
		onDestroy,
		onMount,
		SvelteComponent,
		SvelteComponentTyped,
	} from "svelte";
	import type {
		ComponentProperties,
		StoredComponent,
		StoredComponentTyped,
		SvelteComponentWithProps,
	} from "$lib/stores/types";
	import cx from "classnames";
	import { preloadData } from "$app/navigation";
	import type { IconName } from "$lib/icons";
	import Icon from "../helpers/Icon.svelte";
	import type { Maybe } from "@trpc/server";
	import { chosenIcon, type ChosenIcon } from "$lib/types/icon";
	import { page } from "$app/stores";
	import type { Page } from "@sveltejs/kit";
	import ChosenIconComponent from "../ChosenIcon.svelte";
	import {
		createQuery,
		CreateQueryOptions,
		CreateQueryResult,
	} from "@tanstack/svelte-query";
	import { match } from "ts-pattern";
	import debouncefn from "lodash/debounce";

	function commandListener({ detail: e }: CustomEvent<KeyboardEvent>) {
		if (e.key === "Escape") {
			open = false;
		}
	}

	export let placeholder: string = "Search…";
	export let debounce: number | undefined = undefined;

	$: QueryResult = queryResult ? queryResult($term) : undefined;

	$: debounced = debouncefn(
		(value: string) => {
			term.set(value);
		},
		debounce,
		{
			leading: true,
			trailing: true,
		}
	);
</script>

<div transition:fadeScale|local={{ duration: 150, baseScale: 0.95 }}>
	<!-- TODO: make onselect a prop -->
	<Combobox
		values={Query && $Query?.isSuccess
			? $Query.data
			: QueryResult && $QueryResult?.isSuccess
			? $QueryResult.data
			: $filteredActions || []}
		on:input={(e) => {
			console.log({ $term });
			if (
				e.currentTarget &&
				"value" in e.currentTarget &&
				typeof e.currentTarget.value === "string"
			) {
				if (debounce) {
					debounced(e.currentTarget.value);
				} else {
					term.set(e.currentTarget.value);
				}
			}
		}}
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
			if (prefetchProp) {
				preloadData(prefetchProp(e.detail));
			}
		}}
		input={{
			class:
				"w-full bg-transparent text-lg border-0 focus:ring-0 text-content placeholder-muted p-4",
			placeholder,
		}}
		inputParent={{
			class: "flex items-center",
		}}
		options={{
			class: `max-h-96 text-sm overflow-y-auto scrollbar-thin scrollbar scrollbar-thumb-border hover:scrollbar-thumb-muted scrollbar-thumb-rounded-lg scrollbar-track-transparent	 ${
				!$filteredActions?.length &&
				(!Query || !$Query?.data?.length) &&
				(!QueryResult || !$QueryResult?.data?.length)
					? "hidden"
					: ""
			}`,
		}}
		static={true}
		expanded={true}
		class="relative mx-auto max-w-2xl divide-y divide-border overflow-hidden rounded-xl bg-elevation  shadow-3xl ring-1 ring-border/50 transparency:bg-elevation/70 transparency:backdrop-blur-2xl transparency:backdrop-brightness-125 transparency:backdrop-contrast-100 transparency:backdrop-saturate-200 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200"
	>
		<svelte:fragment slot="inputPeer">
			{#if searchIcon || Query || QueryResult}
				{@const loading =
					(Query && $Query?.isInitialLoading) ||
					(QueryResult && $QueryResult?.isInitialLoading)}
				<div class="my-3 ml-3 flex items-center">
					<Icon
						name={loading ? "loading" : "search"}
						className={cx("w-4 h-4 transition", {
							"animate-spin": loading,
							"stroke-muted": !loading,
							"fill-muted": loading,
						})}
					/>
				</div>
			{/if}
		</svelte:fragment>
		<div slot="option" let:value let:active let:selected let:index>
			{#if value.group}
				<div class="h-4 w-full py-2">
					{value.group}
					<div class="h-px bg-border" />
				</div>
			{/if}
			<slot {value} {active} {selected} {index}>
				{#if slot}
					{@const { component, props } = slot({
						value,
						active,
						selected,
						index,
					})}
					{#if props}
						<svelte:component this={component} {...props} />
					{:else}
						<svelte:component
							this={component}
							{value}
							{active}
							{selected}
							{index}
						/>
					{/if}
				{:else}
					<div
						class="relative text-content/90 {active
							? ' bg-elevation-hover '
							: ''} flex h-12 w-full items-center gap-3.5 px-4 py-2"
					>
						{#if active}
							<div class="absolute left-0 h-full w-1 bg-accent" />
						{/if}
						{#if itemIcon}
							{@const { component, props } = itemIcon(
								value,
								active,
								selected,
								index
							)}
							{#if component}
								<svelte:component this={component} {...props} />
							{/if}
						{/if}
						{#if value.icon && typeof value.icon === "string"}
							<Icon name={value.icon} />
						{:else}
							{@const parsed = chosenIcon.safeParse(value.icon)}
							{#if parsed.success}
								<ChosenIconComponent chosenIcon={parsed.data} />
							{/if}
						{/if}
						<div class="grow-0 truncate">
							{#if itemDisplay}
								{@const item = itemDisplay(value, active, selected, index)}
								{#if typeof item === "string"}
									{@html item}
								{:else}
									<svelte:component this={item.component} {...props} />
								{/if}
							{:else}
								{@html typeof value === "string"
									? value
									: value.name || value.title}
							{/if}
						</div>
						{#if value.kbd}
							<div class="flex">
								{#each value.kbd as shortcut}
									{#each shortcut as kbd}
										<kbd class="text-gray-600 dark:text-gray-300">{kbd}</kbd>
									{/each}
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</slot>
		</div>
	</Combobox>
</div>
