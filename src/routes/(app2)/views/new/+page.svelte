<script lang="ts">
	import { enhance } from '$app/forms';
	// import EntryList from '$lib/components/entries/EntryList.svelte';
	import { Badge } from '$components/ui/badge'
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter,CardHeader, CardTitle } from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import NativeSelect from '$lib/components/ui/NativeSelect.svelte';
	import { Lead } from '$lib/components/ui/typography';
	import H1 from '$lib/components/ui/typography/H1.svelte';
	import { number_operand_lookup, number_operands, types } from '$lib/types';

	import type { Condition } from './View';

	export let data;

	export let form;

	// type Condition = {
	// 	filter: "Type";
	// 	type: "Book" | "Movie";
	// };

	const conditions: Array<Condition> = [];

	let submitting = false;
</script>

<H1>Views</H1>

<!-- {JSON.stringify(conditions)} -->

<Lead>Show me:</Lead>

<Card>
	<form
		method="post"
		use:enhance={() => {
			submitting = true;
			return async ({ result, update }) => {
				submitting = false;
				update({
					reset: false
				});
			};
		}}
		data-sveltekit-keepfocus
		action="?/add"
		class="contents"
	>
		<CardHeader>
			<Input value={data.name} name="name" placeholder="Untitled view" />
			<NativeSelect>
				<option>Bookmarks</option>
			</NativeSelect>
			where
		</CardHeader>
		<CardContent>
			{#each data.conditions as condition, i}
				<!-- {JSON.stringify(condition)} -->
				<div class="flex items-center gap-x-4">
					<input type="hidden" name="id" value={condition.id} />
					<input type="hidden" name="type" value={condition.type} />
					{#if !('operand' in condition)}
						<input type="hidden" name="operand" value={false} />
					{/if}
					<Badge class="text-sm" variant="secondary">{condition.type}</Badge>
					is

					<!-- TODO: make this consolidated in View.ts somehow -->
					{#if condition.type === 'Type'}
						<NativeSelect required value={condition.filter} name="filter">
							{#each types as type}
								<option selected={condition.filter === type} value={type}>{type}</option>
							{/each}
						</NativeSelect>
					{:else if condition.type === 'Status'}
						<NativeSelect required value={condition.filter} name="filter">
							<option>Now</option>
							<option>Backlog</option>
							<option>Archive</option>
						</NativeSelect>
					{:else if condition.type === 'Tag'}
						<NativeSelect name="filter">
							{#each data.tags ?? [] as tag}
								<option value={tag.id} selected={condition.filter === tag.id}>{tag.name}</option>
							{/each}
						</NativeSelect>
					{:else if condition.type === 'Content'}
						<Input value={condition.filter} type="text" name="filter" />
					{:else if condition.type === 'Notes'}
						{condition.filter}
						<NativeSelect name="filter">
							<option value={true} selected={condition.filter}>Contains notes</option>
							<option value={false} selected={!condition.filter}> Does not contain notes</option>
						</NativeSelect>
					{:else if condition.type === 'Progress'}
						<!-- TODO -->
						<NativeSelect name="operand">
							{#each number_operands as operand}
								<option value={operand} selected={condition.operand === operand}
									>{number_operand_lookup[operand]}</option
								>
							{/each}
						</NativeSelect>
						<Input value={condition.filter} type="number" name="filter" />
					{:else if condition.type === 'Word Count'}
						<!-- TODO -->
						<NativeSelect name="operand">
							{#each number_operands as operand}
								<option value={operand} selected={condition.operand === operand}
									>{number_operand_lookup[operand]}</option
								>
							{/each}
						</NativeSelect>
						<Input value={condition.filter} type="number" name="filter" />
					{:else if condition.type === 'Publisher'}
						<Input value={condition.filter} type="text" name="filter" />
					{:else if condition.type === 'Added'}
						in the last
						<NativeSelect name="filter">
							{#each ['Day', 'Week', 'Month', 'Year'] as filter}
								<option
									value={filter.toUpperCase()}
									selected={condition.filter === filter.toUpperCase()}>{filter}</option
								>
							{/each}
						</NativeSelect>
					{/if}
					<Button disabled={submitting} variant="destructive" formaction="?/delete">x</Button>
				</div>
			{/each}
		</CardContent>
		<CardFooter>
			<Label for="add_type">Add type</Label>
			<NativeSelect id="add_type" class="w-max" name="add_type">
				{#each data.condition_types as type}
					<option value={type}>{type}</option>
				{/each}
			</NativeSelect>
			<Button disabled={submitting}>+</Button>
			<Button disabled={submitting} formaction="?/preview">Preview</Button>
			<Button disabled={submitting} variant="destructive" formaction="?/clear">Clear</Button>
			<Button disabled={submitting} formaction="?/save">Save</Button>
		</CardFooter>
	</form>
</Card>
{#if form?.entries}
	<!-- <EntryList class="mt-6" bulkForm={data.bulkForm} entries={form.entries} /> -->
{/if}
