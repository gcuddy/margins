<script lang="ts" context="module">
	const _contextKey = "filter__chosenConditions";

	function createChosenConditionStore() {
		const state = writable<ChosenCondition[]>([]);

		function add(condition: ChosenCondition) {
			state.update((s) => [...s, condition]);
		}
		function remove(idx: number) {
			state.update((s) => s.filter((_, i) => i !== idx));
		}
		function reset() {
			state.set([]);
		}
		return {
			subscribe: state.subscribe,
			set: state.set,
			add,
			remove,
			reset,
		};
	}

	type ChosenConditionStore = ReturnType<typeof createChosenConditionStore>;

	function setFilterContext(store: ChosenConditionStore): void {
		setContext(_contextKey, store);
	}

	export function getFilterContext(): ChosenConditionStore {
		const store = getContext(_contextKey);
		if (!store) {
			throw new Error("No filter context found. Did you forget to wrap your component?");
		}
		return store as ChosenConditionStore;
	}

	type Value<T> = {
		title: string;
		where?: T;
		id: string;
		icon?: IconName;
	};
	type Condition<TWhereInput extends {}, TModel extends Record<keyof TWhereInput, any>> = {
		[K in keyof TWhereInput]: {
			title: string;
			field: K;
			id: string;
			/** Set input to false if it doesn't require anything? */
			input?: boolean;
			icon?: IconName;
			// TODO:
			multiple?: boolean;
			type?: NonNullable<TModel[K]> extends string
				? "string"
				: NonNullable<TModel[K]> extends number
				? "number"
				: // string[] indicates enum
				  "string" | "number" | undefined | "boolean" | "date";
			// values:
			// 	| NonNullable<Value<TWhereInput[K]>>[]
			// 	| ((
			// 			value: NonNullable<TModel[K]> extends Primitive ? NonNullable<TModel[K]> : any
			// 	  ) => NonNullable<Value<TWhereInput[K]>>[]);
			values: (
				value: NonNullable<TModel[K]> extends Primitive ? NonNullable<TModel[K]> : unknown,
				page: Page
			) => Value<TWhereInput[K]>[] | Promise<Value<TWhereInput[K]>[]>;
		};
	}[keyof TWhereInput];

	export type EntryWhereInput = Omit<Prisma.EntryWhereInput, "AND" | "OR" | "NOT" | "data">;

	// REVIEW: Supressing this error for now while I figure out how to fix it (need to fix generic parameter to be smarter)
	// @ts-expect-error
	type ConditionForEntry = NonNullable<Condition<EntryWhereInput, Entry>>;

	export type ChosenCondition = Omit<ConditionForEntry, "values"> & {
		value: {
			where: EntryWhereInput[keyof EntryWhereInput];
			id: string;
			value?: string | number | boolean;
			title?: string;
			icon?: IconName;
		};
	};

	const intsLookup = {
		gt: "Greater than",
		gte: "Greater than or equal to",
		lt: "Less than",
		lte: "Less than or equal to",
		equals: "Equals",
	} as const;

	const stringsLookup = {
		equals: "Equals",
		contains: "Contains",
		startsWith: "Starts with",
		endsWith: "Ends with",
		not: "Does not equal",
	} as const;

	const strings = Object.entries(stringsLookup) as Entries<typeof stringsLookup>;

	const stringValues = (value: string) =>
		strings.map(([id, title]) => ({
			title,
			id,
			where: {
				[id]: value,
			},
		}));

	const datesLookup = {
		gt: "After",
		gte: "On or after",
		lt: "Before",
		lte: "On or before",
		equals: "Equals",
	} as const;

	const dates = Object.entries(datesLookup) as Entries<typeof datesLookup>;

	const dateValues = (value: string | Date) =>
		dates.map(([id, title]) => ({
			title,
			id,
			where: {
				[id]: value,
			},
		}));

	export const conditions: ConditionForEntry[] = [
		{
			title: "Progress",
			field: "interactions",
			id: "progress",
			type: "number",
			icon: "checkCircleMini",
			values: (value: number, page) => {
				return Object.entries(intsLookup).map(([key, title]) => ({
					title,
					id: key,
					where: {
						some: {
							userId: page.data.user?.id,
							progress: {
								[key]: value,
							},
						},
					},
				}));
			},
		},
		{
			title: "Author",
			field: "author",
			id: "author",
			type: "string",
			icon: "userCircleMini",
			values: stringValues,
		},
		{
			title: "Title",
			field: "title",
			id: "title",
			icon: "bars3BottomLeftMini",
			type: "string",
			values: stringValues,
		},
		{
			// REVIEW: should url be for sitename/domain instead?
			title: "URL",
			field: "uri",
			icon: "linkMini",
			id: "uri",
			type: "string",
			values: stringValues,
		},
		{
			// REVIEW: should url be for sitename/domain instead?
			title: "Tag",
			field: "tags",
			icon: "tagMini",
			id: "tags",
			// if this is true, combine ids into a single in or notin filter
			multiple: true,
			type: "boolean",
			// TODO: include, does not include; multiple: include if any of, include if all of, exclude if any of, exclude if all of
			// could values get passed in as an array?
			// OR: when building filter, look for identical id and combine in a single filter
			values: async (_, page) => {
				const queryClient = page.data.queryClient;
				const userId = page.data.user?.id;
				const tags = await queryClient.ensureQueryData(listTagsQuery());
				return tags.map((tag) => ({
					title: tag.name,
					id: tag.name,
					where: {
						some: {
							id: tag.id,
							// userId,
						},
					},
				}));
			},
		},
		{
			title: "Type",
			icon: "documentMagnifyingGlassMini",
			field: "type",
			id: "type",
			type: "boolean",
			values: () =>
				Object.values(DocumentType).map((type) => ({
					title: type,
					id: type,
					where: type,
				})),
		},
		{
			title: "Content",
			icon: "documentTextMini",
			field: "text",
			id: "content",
			type: "string",
			// TODO: if there's only one value, go right to it
			values: (value: string) => {
				return [
					{
						title: "Search",
						id: "search",
						where: {
							search: value,
						},
					},
				];
			},
		},
		{
			title: "Published",
			icon: "calendarMini",
			field: "published",
			id: "published",
			type: "date",
			values: dateValues
		},
	];
</script>

<script lang="ts">
	import Button from "$lib/components/Button.svelte";

	import GenericInput from "$lib/components/GenericInput.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import type { IconName } from "$lib/icons";
	import { createStack } from "$lib/stores/undo";
	import { DocumentType, Prisma } from "@prisma/client";
	import { ComponentProps, getContext, SvelteComponent } from "svelte";
	import { writable } from "svelte/store";
	import type { Entries } from "type-fest";
	import type { Primitive } from "zod";
	import { useFilterQuery } from "./filter";

	type E = EntryWhereInput["published"];
	const e: E = {};

	const store = useFilterQuery();
	// $store = [
	// 	{
	// 		author: {
	// 			contains: "",
	// 		},
	// 	},
	// ];

	let type: "string" | "number" | "boolean" = "string";

	let values = [
		{
			name: "Progress",
			type: "number",
		},
		{
			name: "Author",
			type: "string",
		},
	];
	let value = values[0];

	let filter: string;

	$: input = {
		[filter]: dynamicValue,
	};

	let dynamicValue: string | number;

	const inputValue = writable("");
	$: filteredConditions = conditions.filter((condition) =>
		condition.title.toLowerCase().includes($inputValue.trim())
	);

	let ref: HTMLElement;

	type X = ConditionForEntry["values"];

	type BasicConditionOrValue = {
		title: string;
		field?: keyof EntryWhereInput;
		id: string;
		icon?: IconName;
		type?: "string" | "number" | "boolean";
		values?: (value: any, userId?: string) => BasicConditionOrValue[];
		where?: EntryWhereInput[keyof EntryWhereInput];
	};

	let selectedCondition: BasicConditionOrValue | null = null;

	let show_input = false;

	// how to allow for other inputs?

	// this doesn't work - get to work!
	type InputComponents = {
		[key: string]: <T extends SvelteComponent>() => {
			component: T;
			props: ComponentProps<T>;
		};
	};

	let inputComponents = {
		string: {
			component: GenericInput,
			props: {
				type: "text",
			},
			value: "",
			title: "Filter by",
		},
		number: {
			component: GenericInput,
			props: {
				type: "number",
			},
			value: 0,
			title: "Filter by",
		},
	} as const;

	let strI = <T extends SvelteComponent>(component: T, props: ComponentProps<T>, title: string) => {
		return (value: string) => ({
			component,
			props: {
				...props,
				value,
			},
			title,
		});
	};

	// $: selected_input = selectedCondition?.type && inputComponents[selectedCondition?.type];
	// $: selected_values = selectedCondition?.values?.(selected_input?.value) || [];
	// $: selected_values.map;

	import type { Placement } from "@popperjs/core";
	import { Popover, PopoverButton, PopoverPanel } from "@rgossiaux/svelte-headlessui";
	import { createPopperActions } from "svelte-popperjs";
	import EntryFilterCondition from "./EntryFilterCondition.svelte";
	import GenericListbox from "$lib/components/helpers/GenericListbox.svelte";
	import { createQuery, useQueryClient } from "@tanstack/svelte-query";
	import { trpc } from "$lib/trpc/client";
	import EntryFilterButton from "./EntryFilterButton.svelte";
	import { setContext } from "svelte";
	import Select from "$lib/components/atoms/Select.svelte";
	import { page } from "$app/stores";
	import type { Page } from "@sveltejs/kit";
	import { listTagsQuery } from "../tags/queries";
	import EntryList from "$lib/components/EntryList.svelte";
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

	let chosenConditions: ChosenCondition[] = [];

	// REVIEW: we should include conditions in the store, that way they're customizable depending on context
	const chosenConditionsStore = createChosenConditionStore();
	setFilterContext(chosenConditionsStore);
	$: wheres = $chosenConditionsStore.map((c) => ({
		[c?.field]: c?.value?.where,
	}));
	$: where = {
		[and]: wheres,
	};
	$: console.log({ where });
	$: console.log({ $chosenConditionsStore });

	// TODO: should be stored with store and serialized
	let and: "AND" | "OR" | "NOT" = "AND";

	$: query = createQuery({
		enabled: !!$chosenConditionsStore.length,
		queryKey: ["filter", { where }],
		queryFn: async () => {
			return trpc().entries.filter.query({
				where,
			});
		},
		keepPreviousData: true,
		staleTime: 60 * 1000 * 60,
	});

	$: console.log({ $query });
</script>

<!-- TODO: make chosenConditions into a store, don't bind to index but prefer .push onsave/confirm/close -->


{#if !$chosenConditionsStore.length}
	<EntryFilterButton />
{:else}
	<div>
		<Button variant="dashed" className="space-x-1 text-sm" on:click={chosenConditionsStore.reset}>
			<Icon name="xMarkMini" className="h-4 w-4 fill-muted" /> <span>Clear Filters</span>
		</Button>
	</div>
{/if}

{#if $chosenConditionsStore.length > 1}
	<!-- transition:fly|local={{ y: -5 }} -->
	<div class="text-sm text-gray-500">
		<span>
			If
			<Select block={false} bind:value={and} class="mx-1 py-1 pr-8 text-sm">
				<option value="AND">All</option>
				<option value="OR">Any</option>
				<option value="NOT">None</option>
			</Select>
			of the following conditions are met
		</span>
	</div>
{/if}

<div class="flex gap-1">
	{#each $chosenConditionsStore as filter, index}
		{#if filter}
			{@const condition = conditions.find((c) => c.id === filter?.id)}
			{@const conditionValues = condition?.values(filter?.value?.value, $page) || []}
			<div
				class="flex h-6 max-w-min shrink items-stretch gap-0.5 truncate rounded text-xs ring-1 ring-border "
			>
				<div class="flex items-center gap-1 px-1.5">
					{#if filter?.icon}
						<Icon name={filter.icon} className="h-4 w-4 fill-gray-600" />
					{/if}
					<span>
						{filter?.title}
					</span>
				</div>
				{#if Array.isArray(conditionValues) && filter?.type !== "boolean"}
					<GenericListbox
						class="flex items-center bg-base px-1.5"
						let:value={listboxValue}
						value={filter?.value}
						values={conditionValues}
						onChange={(v) => {
							filter.value.id = v.id;
							filter.value.where = v.where;
							filter.value.title = v.title;
						}}
					>
						<button slot="button" let:value>{value?.title}</button>
						<div>
							{listboxValue.title}
						</div>
					</GenericListbox>
				{:else if filter?.value?.title}
					<span class="flex items-center bg-base px-1.5">
						<!-- TODO: clicking this should trigger listbox with other options -->
						{filter?.value.title}
					</span>
				{/if}
				<span class="flex items-center bg-base px-1.5">
					{filter?.value.value}
				</span>
				<button
					class="flex items-center bg-base px-1.5"
					on:click={() => {
						chosenConditionsStore.remove(index);
					}}><Icon name="xMarkMini" className="h-4 w-4 fill-gray-400" /></button
				>
			</div>
		{/if}
	{/each}
	{#if $chosenConditionsStore.length}
		<EntryFilterButton slim={true} />
	{/if}
</div>

<!-- {JSON.stringify($chosenConditionsStore, null, 2)} -->

{#if $query.isInitialLoading}
	<div>Loading...</div>
{/if}

{#if $query.isSuccess && $query.data}
	<EntryList items={$query.data} />
{/if}
