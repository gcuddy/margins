<script lang="ts" context="module">
	type And = "AND" | "OR" | "NOT";

	const createTrpcInit = () => {
		return (init?: TRPCClientInit) => {
			return trpc(init);
		};
	};

	export const filterQuery = (filter: Record<And, Prisma.EntryWhereInput[]>, init?: TRPCClientInit) => ({
		queryKey: ["entries", "filter", filter],
		queryFn: async () =>
			trpc(init).entries.filter.query({
				where: filter,
			}),
		staleTime: 1000 * 60 * 5,
		// enabled: false,
		// enabled: !!filter["AND"],
		// keepPreviousData: true,
	});

	type FilterState = {
		conditions: Writable<ChosenEntryCondition>[];
		and: Writable<"AND" | "OR" | "NOT">;
		input: Writable<Array<Prisma.EntryWhereInput>>;
		filter: Readable<Prisma.EntryWhereInput>;
		queryOptions: CreateQueryResult<typeof filterQuery>;
	};

	export function usexFilterContext(componentName: string) {
		const context: FilterState = getContext("filterContext");
		if (!context) {
			throw new Error(
				`Could not find filter context for component ${componentName}. Did you forget to wrap your component in <Filter />?`
			);
		}
		return context;
	}
</script>

<script lang="ts">
	import { page } from "$app/stores";


	import type { Prisma } from "@prisma/client";
	import { createQuery, CreateQueryResult, QueryFunctionContext } from "@tanstack/svelte-query";
    import debounce from "lodash.debounce"
	import { getContext, setContext } from "svelte";
	import { derived, Readable, Writable, writable } from "svelte/store";
	import type { TRPCClientInit } from "trpc-sveltekit";
	import type { ChosenEntryCondition } from "./Condition.svelte";

	const defaultCondition: ChosenEntryCondition = {
		field: "author",
		type: "string",
		filter_id: "author-contains",
		value: "",
		id: "author",
	};

	const createFilterStore = () => {
		const conditions = writable<ChosenEntryCondition[]>([]);
		const and = writable<"AND" | "OR" | "NOT">("AND");
		const input = writable<Array<Prisma.EntryWhereInput>>([]);
		const filter = derived([input, and], ([input, and]) => ({
			[and]: input,
		}));
		const queryOptions = derived(filter, (filter) => {
			return {
				queryKey: ["entries", "filter", filter],
				queryFn: async () =>
					trpc($page).entries.filter.query({
						where: filter,
					}),
				staleTime: 1000 * 60 * 5,
				// enabled: false,
				// enabled: !!filter["AND"],
				// keepPreviousData: true,
			};
		});
		return {
			...conditions,
			and,
			input,
			filter,
			queryOptions,
			actions: {
				new: () => conditions.update((conditions) => [...conditions, { ...defaultCondition }]),
			},
		};
	};

	const filterStore = createFilterStore();

	setContext("filterContext", filterStore);

	const { queryOptions } = filterStore;

	$: query = createQuery($queryOptions);
</script>

<slot />

<!-- <div class="my-4 mx-5 flex rounded bg-gray-100 dark:bg-gray-800  ">
	<form class="w-full">
		<div class="flex flex-col space-y-2 divide-y p-4 dark:divide-gray-700">
			<div class="flex flex-col gap-4 pt-4 md:flex-row md:justify-between">
				<div class="grow space-y-2">
					{#if conditions.length > 1}
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
					<div class="space-y-2">
						{#each conditions as condition, index (condition.id)}
							<Condition
								on:delete={() => (conditions = conditions.filter((c) => c.id !== condition.id))}
								bind:condition
								bind:json={json[index]}
							/>
						{/each}
						<Button on:click={filterStore.actions.new} variant="dashed" className="pl-1"
							><Icon name="plusSmSolid" />New Condition</Button
						>
					</div>
				</div>
				<div class="flex space-x-2">
					<Button variant="link" as="a" href="/smart">Cancel</Button>
					<Button variant="ghost" on:click={() => $query.refetch()}>Preview</Button>
					<Button on:click={saveFilter} variant="primary">Create</Button>
				</div>
			</div>
		</div>
	</form>
</div> -->
