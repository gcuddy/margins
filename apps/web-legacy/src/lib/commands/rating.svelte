<script lang="ts">
	import { CommandItem } from '$components/ui/command2';

    type TUnrated = $$Generic<boolean>;
    export let showUnrated: TUnrated = true as TUnrated;

    export let onSelect: (rating: TUnrated extends true ? number | 'unrated' : number) => void;

</script>

<CommandItem
	value="Unrated"
	onSelect={(rating) => {
		if (rating && showUnrated) {
            //@ts-ignore
			onSelect('unrated');
		}
	}}
>
	Unrated
</CommandItem>
{#each [1, 2, 3, 4, 5] as rating}
	<CommandItem
		value={rating}
		onSelect={(rating) => {
			if (rating) {
                //@ts-ignore
				onSelect(rating);
			}
		}}
	>
		{#each Array(rating) as _}
			★
		{/each}
	</CommandItem>
{/each}
