
<script lang='ts'>
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import Select from "$lib/components/atoms/Select.svelte";
import Button from "$lib/components/Button.svelte";
	import GenericListbox from "$lib/components/helpers/GenericListbox.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { conditions, getFilterContext } from "./EntryFilter.svelte";
	import EntryFilterButton from "./EntryFilterButton.svelte";

   const chosenConditionsStore = getFilterContext();
</script>
{#if !$chosenConditionsStore.conditions.length}
	<EntryFilterButton />
{:else}
	<div>
		<Button variant="dashed" className="space-x-1 text-sm" on:click={chosenConditionsStore.reset}>
			<Icon name="xMarkMini" className="h-4 w-4 fill-muted" /> <span>Clear Filters</span>
		</Button>
	</div>
{/if}

{#if $chosenConditionsStore.conditions.length > 1}
	<!-- transition:fly={{ y: -5 }} -->
	<div class="text-sm text-gray-500">
		<span>
			If
			<Select block={false} bind:value={$chosenConditionsStore.and} class="mx-1 py-1 pr-8 text-sm">
				<option value="AND">All</option>
				<option value="OR">Any</option>
				<option value="NOT">None</option>
			</Select>
			of the following conditions are met
		</span>
	</div>
{/if}

<div class="flex gap-1">
	{#each $chosenConditionsStore.conditions as filter, index}
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
                <!-- check to make sure we're in browser, since we're passing in a promise -->
				{#if Array.isArray(conditionValues) && filter?.type !== "boolean" && filter?.value && browser}
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
	{#if $chosenConditionsStore.conditions.length}
		<EntryFilterButton slim={true} />
	{/if}
</div>

<!-- {JSON.stringify($chosenConditionsStore, null, 2)} -->
