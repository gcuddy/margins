<script lang="ts" context="module">
	const _contextKey = "filter__chosenConditions";

	function createChosenConditionStore({
        conditions,
        and
    }: {
        conditions: ChosenCondition[];
        and: "AND" | "OR" | "NOT";
    }) {
		const state = writable<{
            and: "AND" | "OR" | "NOT";
            conditions: ChosenCondition[];
        }>({
            and,
            conditions
        });

		function add(condition: ChosenCondition) {
			state.update((s) => {
                return {
                    and: s.and,
                    conditions: [...s.conditions, condition]
                }
            });
		}
		function remove(idx: number) {
			state.update((s) => {
                return {
                    and: s.and,
                    conditions: s.conditions.filter((_, i) => i !== idx)
                }
            });
		}
		function reset() {
			state.set({
                and: "AND",
                conditions: []
            });
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
            title: "Status",
            field: "bookmarks",
            icon: "inboxStackMini",
            id: "status",
            multiple: false,
            type: "boolean",
            values: async (_, page) => {
                const queryClient = page.data.queryClient;
                const userId = page.data.user?.id;
                const states = page.data.user?.states || [];
                return states.map(state => ({
                    title: state.name,
                    id: state.name,
                    where: {
                        some: {
                            userId,
                            stateId: state.id,
                        }
                    }
                }))
            }
        },
        {
            title: "Status Type",
            field: "bookmarks",
            icon: "circleStackMini",
            id: "status-type",
            multiple: false,
            type: "boolean",
            values: async (_, page) => {
                const queryClient = page.data.queryClient;
                const userId = page.data.user?.id;
                const states = page.data.user?.states || [];
                const locations = Array.from(new Set(states.map(state => state.type)));
                return locations.map(location => ({
                    title: location,
                    id: location,
                    where: {
                        some: {
                            userId,
                            state: {
                                type: location,
                            }
                        }
                    }
                })).concat({
                    title: "Is not archive",
                    id: "is-not-archive",
                    where: {
                        none: {
                            userId,
                            state: {
                                type: "archive",
                            }
                        }
                    }
                })
            }
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

	import GenericInput from "$lib/components/GenericInput.svelte";
	import type { IconName } from "$lib/icons";
	import { DocumentType, Location, Prisma } from "@prisma/client";
	import { ComponentProps, getContext, SvelteComponent } from "svelte";
	import { writable } from "svelte/store";
	import type { Entries } from "type-fest";
	import type { Primitive } from "zod";
	import { useFilterQuery } from "./filter";
// $: selected_input = selectedCondition?.type && inputComponents[selectedCondition?.type];
	// $: selected_values = selectedCondition?.values?.(selected_input?.value) || [];
	// $: selected_values.map;

	import { trpc } from "$lib/trpc/client";
	import type { Placement } from "@popperjs/core";
	import type { Page } from "@sveltejs/kit";
	import { createQuery } from "@tanstack/svelte-query";
	import { setContext } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { listTagsQuery } from "../tags/queries";
	import { page } from "$app/stores";

	type T = $$Generic;

	export let placement: Placement = "bottom-start";

	let buttonRef: HTMLElement;
	const [popperRef, popperContent] = createPopperActions({
		placement,
		strategy: "absolute",
	});

	let filter_open = false;

	let button: HTMLButtonElement;

	export let conditions: ChosenCondition[] = [];
    export let and: "AND" | "OR" | "NOT" = "AND";
	// REVIEW: we should include conditions in the store, that way they're customizable depending on context
	export let chosenConditionsStore = createChosenConditionStore({
        conditions,
        and
    });
	setFilterContext(chosenConditionsStore);
	$: wheres = $chosenConditionsStore.conditions.map((c) => ({
		[c?.field]: c?.value?.where,
	}));
	$: where = {
		[$chosenConditionsStore.and]: wheres,
	};
	$: console.log({ where });
	$: console.log({ $chosenConditionsStore });

	// TODO: should be stored with store andj serialized

	$: query = createQuery({
		enabled: !!$chosenConditionsStore.conditions.length,
		queryKey: ["filter", { where }],
		queryFn: async () => {
			return trpc($page).entries.filter.query({
				where,
			});
		},
		keepPreviousData: true,
		staleTime: 60 * 1000 * 60,
	});

	$: console.log({ $query });
</script>

<!-- TODO: make chosenConditions into a store, don't bind to index but prefer .push onsave/confirm/close -->
<slot query={$query} {where} chosenConditions={$chosenConditionsStore} />
