<script lang="ts">
	import MiniSelect from '$lib/components/atoms/MiniSelect.svelte';
	import { createEventDispatcher } from 'svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import { matchFieldToType, type SmartListCondition } from '$lib/types/filter';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import type { Prisma } from '@prisma/client';
	import LocationListbox from '$lib/components/LocationListbox.svelte';
	export let condition: SmartListCondition;

	const dispatch = createEventDispatcher();

	$: condition.type = matchFieldToType(condition.field);

	/** read only pls */
	export let json: Prisma.ArticleWhereInput = {};
	$: json = {
		[condition.field]: {
			[condition.filter]: condition.value,
		},
	};
	$: condition.field === 'readProgress'
		? (json[condition.field][condition.filter] = (condition.value as number) / 100)
		: null;
	// $: condition.type === 'StringFilter' && condition.field !== 'location'
	// 	? ((json[condition.field] as any).mode = 'insensitive')
	// 	: null;
</script>

<div class="flex items-center space-x-1">
	<MiniSelect bind:value={condition.field}>
		<option value="author">Author</option>
		<option value="title">Title</option>
		<option value="url">URL</option>
		<option value="readProgress">Read Progress</option>
		<option value="tags">Tags</option>
		<option value="location">Location</option>
	</MiniSelect>
	<MiniSelect name="{condition.field}-filter" bind:value={condition.filter}>
		{#if condition.field === 'location'}
			<option value="equals">Is</option>
			<option value="not">Is not</option>
		{:else if condition.type === 'StringFilter'}
			<option value="contains">Contains</option>
			<option value="equals">Is</option>
		{:else if condition.type === 'NumberFilter'}
			<option value="lt">Less than</option>
			<option value="gt">Greater than</option>
			<option value="equals">Equals</option>
		{/if}
	</MiniSelect>

	{#if condition.field === 'location'}
		<LocationListbox
			location={condition.value}
			on:change={(e) => {
				condition.value = e.detail;
			}}
		/>
	{:else if condition.type === 'StringFilter' || condition.type === 'SearchFilter'}
		<GenericInput
			variant="filled"
			class="!h-7 flex-auto grow focus:bg-gray-200 dark:focus:bg-gray-700"
			name={condition.field}
			bind:value={condition.value}
		/>
	{:else if condition.type === 'NumberFilter'}
		<GenericInput
			variant="filled"
			type="number"
			placeholder="Enter number"
			min={0}
			max={100}
			class="!h-7 flex-auto grow focus:bg-gray-200 dark:focus:bg-gray-700"
			name={condition.field}
			bind:value={condition.value}
		/>
		<span>%</span>
	{/if}
	<button on:click={() => dispatch('delete')}>
		<Icon name="xSolid" />
		<span class="sr-only">Delete</span>
	</button>
</div>
