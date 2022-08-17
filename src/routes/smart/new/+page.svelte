<script lang="ts">
	import { goto } from '$app/navigation';
	import MiniSelect from '$lib/components/atoms/MiniSelect.svelte';

	import Select from '$lib/components/atoms/Select.svelte';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import GenericTextarea from '$lib/components/GenericTextarea.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import { useId } from '$lib/hooks/use-id';
	import { notifications } from '$lib/stores/notifications';
	import type { SmartListCondition } from '$lib/types/filter';
	import type { Article, Prisma, SmartList } from '@prisma/client';
	import { fly } from 'svelte/transition';

	export let smartLists: SmartList[] = [];

	import { z } from 'zod';
	type ArticleInput = {
		author: StringFilter;
	};

	// const createArticleFilter = (condition: SmartListCondition) => {
	// 	const obj: Prisma.ArticleWhereInput = {};
	// 	console.log({ condition });
	// 	console.log({ obj });
	// 	return Prisma.validator<Prisma.ArticleWhereInput>()({
	// 		[condition.field]: {
	// 			contains: condition.value
	// 		}
	// 	});
	// };
	let json: Array<Prisma.ArticleWhereInput> = [];
	let name = '';
	// let json: Prisma.ArticleWhereInput = {};
	let and: 'AND' | 'OR' | 'NOT' = 'AND';
	// $: json[and];
	let conditions: SmartListCondition[] = [];
	const defaultCondition: SmartListCondition = {
		field: 'author',
		type: 'StringFilter',
		display: 'Author',
		filter: 'contains',
		value: '',
		id: 0
	};
	const newCondition = () => {
		conditions = [...conditions, { ...defaultCondition, id: useId() }];
	};

	$: json = conditions.map((condition) => {
		return {
			[condition.field]: {
				[condition.filter]: condition.value,
				mode: 'insensitive'
			}
		};
	});

	async function submitFilter() {
		const res = await fetch('/filter.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				[and]: json
			})
		});
		if (res.ok) {
			const { articles } = await res.json();
			current_results = articles;
		}
	}

	async function saveFilter() {
		const res = await fetch(`/smart`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name,
				filter: {
					[and]: json
				}
			})
		});
		if (res.ok) {
			const { id } = await res.json();
			goto(`/smart/${id}`);
			notifications.notify({
				message: 'Smart list created',
				type: 'success'
			});
		}
	}

	let current_results: Article[] = [];

	const updateJson = () => {};
</script>

<div class="my-4 mx-5 flex rounded bg-gray-100 dark:bg-gray-800  ">
	<Form className="w-full">
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
							<div class="flex items-center space-x-1">
								<MiniSelect bind:value={condition.field}>
									<option value="author">Author</option>
									<option value="title">Title</option>
									<option value="url">URL</option>
									<option value="readProgress">Read Progress</option>
									<option value="tags">Tags</option>
								</MiniSelect>
								<MiniSelect name="{condition.field}-filter" bind:value={condition.filter}>
									{#if condition.type === 'StringFilter'}
										<option value="contains">Contains</option>
										<option value="equals">Is</option>
									{:else if condition.type === 'NumberFilter'}
										<option value="lt">Less than</option>
										<option value="gt">Greater than</option>
										<option value="equals">Equals</option>
									{/if}
								</MiniSelect>
								<GenericInput
									variant="filled"
									class="!h-7 flex-auto grow focus:bg-gray-200 dark:focus:bg-gray-700"
									id="condition-{index}"
									name={condition.field}
									bind:value={condition.value}
								/>
								<button
									on:click={() => (conditions = conditions.filter((c) => c.id !== condition.id))}
								>
									<Icon name="xSolid" />
									<span class="sr-only">Delete</span>
								</button>
							</div>
						{/each}
						<Button on:click={newCondition} variant="dashed" className="pl-1"
							><Icon name="plusSmSolid" />New Condition</Button
						>
					</div>
				</div>
				<div class="flex space-x-2">
					<Button variant="link" as="a" href="/smart">Cancel</Button>
					<Button variant="ghost" on:click={submitFilter}>Preview</Button>
					<Button on:click={saveFilter} variant="primary">Create</Button>
				</div>
			</div>
		</div>
	</Form>
</div>
{#if current_results.length}
	<Saved articles={current_results} />
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
		of the following conditions are met
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
