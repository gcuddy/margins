<script lang="ts">
	import MiniSelect from '../atoms/MiniSelect.svelte';
	import Icon from '../helpers/Icon.svelte';
	import AskForInput from './AskForInput.svelte';
	import type { FilterOption } from './Index.svelte';

	export let filter: FilterOption;

	export let dialog = false;

	export let onDelete: () => void;
</script>

<div class="flex items-center gap-1 text-xs">
	{#if filter.icon}
		<Icon name={filter.icon} className="h-4 w-4 fill-gray-500" />
	{/if}
	<span>{filter.name}</span>
	{#if 'modifier' in filter}
		<MiniSelect bind:value={filter.modifier}>
			{#each ['contains', 'does not contain'] as modifier}
				<option>{modifier}</option>
			{/each}
		</MiniSelect>
		<button on:click={() => (dialog = true)}>{filter.value}</button>
	{/if}
	<button class="flex items-center" on:click={onDelete}>
		<Icon className="h-4 w-4 fill-gray-400" name="xSolid" />
	</button>
</div>

{#if dialog && (typeof filter.value === 'string' || typeof filter.value === 'object')}
	<AskForInput
		type={filter.value === 'string' ? 'string' : 'date'}
		bind:open={dialog}
		value={filter.value}
		onSave={(val) => {
			filter.value = val;
		}}
	/>
{/if}
