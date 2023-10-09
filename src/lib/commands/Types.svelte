<script lang="ts">
	import { entryTypeIcon } from '$components/entries/icons';
	import Checkbox from '$components/ui/checkbox/checkbox.svelte';
	import { CommandIcon, CommandItem, ctx } from '$components/ui/command2';
	import { types, type Type } from '$lib/types';

	type TMultiple = $$Generic<boolean>;

	type SelectedProp =
		| {
				multiple: true;
				selected?: Array<Type>;
		  }
		| {
				multiple: false | undefined;
				selected?: Type;
		  };

	type $$Props = {
		onSelect: (type: Type) => void;
	} & SelectedProp;

	export let onSelect: $$Props['onSelect'];

	const { options } = ctx.get();

	export let multiple: $$Props['multiple'] = options.multiple;

	// TODO: this should affect/reflect the state of the command
	export let selected: $$Props['selected'] = undefined;

	$: sortedTypes = [...types].sort((a, b) => {
		// sort selected to top, and sort alphabetically
		const s = selected?.includes(a);
		const s2 = selected?.includes(b);
		if (s && s2) {
			return 0;
		} else if (s) {
        return -1;
		} else if (s2) {
			return 1;
		} else {
			return a.localeCompare(b);
		}
	});
</script>

{#each sortedTypes as type}
	{@const checked = selected?.includes(type)}
	<CommandItem
        selected={checked}
		value={type}
		onSelect={(val) => {
			if (val) onSelect(val);
		}}
	>
		{#if multiple}
			<Checkbox on:click={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }} class="mr-4" {checked} />
		{/if}
		<CommandIcon icon={entryTypeIcon[type]} />
		{type}
	</CommandItem>
{/each}
