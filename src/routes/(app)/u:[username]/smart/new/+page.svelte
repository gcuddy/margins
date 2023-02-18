<script lang="ts">
	import { page } from "$app/stores";

	import Select from "$lib/components/atoms/Select.svelte";
	import Button from "$lib/components/Button.svelte";
	import EntryList from "$lib/components/EntryList.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { trpc } from "$lib/trpc/client";
	import type { Article, Prisma } from "@prisma/client";
	import { createQuery } from "@tanstack/svelte-query";

	import Condition, { ChosenEntryCondition } from "./Condition.svelte";

	let json: Array<Prisma.EntryWhereInput> = [];
	let name = "";
	let and: "AND" | "OR" | "NOT" = "AND";

	let conditions: ChosenEntryCondition[] = [];
	$: console.log({ conditions });
	const defaultCondition: ChosenEntryCondition = {
		field: "author",
		type: "string",
		filter_id: "author-contains",
		value: "",
		id: "author",
		// value: "",
		// filter: {},
		// display: "Author",
		// filter: "contains",
		// value: "",
		// id: 0,
	};

	// TODO: recipe not null
	const newCondition = () => {
		conditions = [...conditions, { ...defaultCondition }];
	};

	// $: json = conditions.map((condition) => {
	// 	return {
	// 		[condition.field]: {
	// 			[condition.filter]: condition.value,
	// 			mode: 'insensitive'
	// 		}
	// 	};
	// });

	async function submitFilter() {
		const res = await fetch("/filter.json", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				[and]: json,
			}),
		});
		if (res.ok) {
			const { articles } = await res.json();
			current_results = articles;
		}
	}

	$: filter = {
		[and]: json,
	};
	$: console.log(["entries", "filter", filter]);
	$: console.log(!!filter[and].length);
	$: query = createQuery({
		queryKey: ["entries", "filter", filter],
		enabled: false,
		// enabled: !!filter[and].length,
		queryFn: async () =>
			trpc($page).entries.filter.query({
				where: filter,
			}),
		onSettled: (data, err) => {
			console.log({ data, err });
		},
		keepPreviousData: true,
	});
	$: console.log({ $query });

	async function saveFilter() {
		console.log({ conditions, filter });
		const smartList = await trpc().filters.save.mutate({
			name,
			conditions,
			filter,
		});
		console.log({ smartList });
	}

	let current_results: Article[] = [];

	const updateJson = () => {};
</script>

<div class="my-4 mx-5 flex rounded bg-gray-100 dark:bg-gray-800  ">
	<form class="w-full">
		<div class="flex flex-col space-y-2 divide-y p-4 dark:divide-gray-700">
			<div class="w-full space-y-2">
				<GenericInput
					bind:value={name}
					class="grow !bg-transparent font-medium"
					placeholder="Untitled smart list"
				/>
				<!-- <GenericTextarea
					placeholder="Description (optional)"
					class="grow resize-none !bg-transparent text-sm"
					rows={1}
				/> -->
			</div>
			<div class="flex flex-col gap-4 pt-4 md:flex-row md:justify-between">
				<div class="grow space-y-2">
					{#if conditions.length > 1}
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
					<div class="space-y-2">
						{#each conditions as condition, index (condition.id)}
							<Condition
								on:delete={() => (conditions = conditions.filter((c) => c.id !== condition.id))}
								bind:condition
								bind:json={json[index]}
							/>
						{/each}
						<Button on:click={newCondition} variant="dashed" className="pl-1"
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
</div>
{#if $query.isInitialLoading}
	Loading...
	<!-- <Saved annotations={current_results} /> -->
{:else if $query.isSuccess}
	<EntryList
		viewOptions={{
			view: "kanban",
		}}
		items={$query.data}
	/>
{/if}

<!-- TODO: make work progressively enhanced with actual forms -->

<!-- <div class="flex max-w-md flex-col ">
	<span>
		If
		<Select block={false} bind:value={and}>
			<option value="AND">Any</option>
			<option value="OR">All</option>
			<option value="NOT">None</option>
		</Select>
		of the following conditions are metk
	</span>
	<Button on:click={newCondition} variant="ghost">New Condition</Button>
	{#each conditions as condition, index (condition.id)}
		<label for="condition-{index}" class="flex items-center">
			<Select bind:value={condition.field}>
				<option value="author">Author</option>
				<option value="title">Title</option>
				<option value="url">URL</option>
			</Select>
		</label>
		<Select name="{condition.field}-filter" bind:value={condition.filter}>
			<option value="contains">Contains</option>
			<option value="equals">Is</option>
		</Select>
		<GenericInput id="condition-{index}" name={condition.field} bind:value={condition.value} />
	{/each}

	<pre>
    {JSON.stringify(json, null, 2)}
  </pre>
	{#if current_results.length}
		<Saved articles={current_results} />
	{/if}
</div> -->
