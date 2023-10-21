<script lang="ts">
	import { types, type Type } from '$lib/types';
	import ConditionLayout from '../helpers/ConditionLayout.svelte';
	import { ctx } from '../ctx';
	import Select from '../helpers/Select.svelte';

	export let type: Type;

	// const {
	// 	elements: { container }
	// } = ctx.get();

	const { state: {
        filterStore
    } } = ctx.get();

</script>

<ConditionLayout name="Type" on:delete={() => {
    filterStore.change(data => {
        delete data.type;
        return data;
    })
}}>
	<Select
		value={type}
		choices={types.map((type) => ({
			name: type,
			value: type
		}))}
		onValueChange={(value) => {
            filterStore.change(data => {
                data.type = value;
                return data;
            })
        }}
	/>
</ConditionLayout>
