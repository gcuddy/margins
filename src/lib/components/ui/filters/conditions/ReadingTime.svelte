<script lang="ts">
	import { types, type Type } from '$lib/types';
	import ConditionLayout from '../helpers/ConditionLayout.svelte';
	import { ctx } from '../ctx';
	import Select from '../helpers/Select.svelte';
	import type { FilterLibrarySchema } from '$lib/schemas/library';

	export let readingTime: NonNullable<FilterLibrarySchema['readingTime']>;

	// reading time should only contain one key, so get that one
	$: [key] = Object.keys(readingTime) as [keyof typeof readingTime];

	const v = [
		{
			value: 'min',
			name: 'at least'
		},
		{
			value: 'max',
			name: 'at most'
		}
	] as const;

	const {
		state: { filterStore }
	} = ctx.get();
</script>

<ConditionLayout
	name="Reading Time"
	on:delete={() => {
		filterStore.change((data) => {
			delete data.readingTime;
			return data;
		});
	}}
>
	<Select
		value={key}
		choices={v.map(({ value, name }) => ({
			name,
			value
		}))}
		onValueChange={(value) => {
			filterStore.change((data) => {
				const time = data.readingTime?.[key];
				if (time) {
					data.readingTime = {
						[value]: time
					};
				}
				return data;
			});
		}}
	>
		{v.find(({ value }) => value === key)?.name}
	</Select>
    <svelte:fragment slot="value">
        {readingTime[key]} minutes
    </svelte:fragment>
</ConditionLayout>
