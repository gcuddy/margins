<script lang="ts">
	import { CommandGroup, CommandItem } from '$components/ui/command2';
	import { objectEntries } from '$lib/helpers';
	import { useStatusMutation } from '$lib/queries/mutations';
	import {
		type Status,
		statusesToDisplay,
		statusesWithIcons,
	} from '$lib/status';

	const mutation = useStatusMutation();

	type $$Props =
		| {
				entryIds: number[];
				open?: boolean;
				onSelect?: (status: Status) => void;
		  }
		| {
				entryIds?: number[];
				open?: boolean;
				onSelect: (status: Status) => void;
		  };

	/**
	 * If provided, will apply the status to the entry with the given ID.
	 */
	export let entryIds: $$Props['entryIds'] = [];
	export let onSelect: $$Props['onSelect'] = () => {};
</script>

<CommandGroup heading="Status">
	{#each objectEntries(statusesToDisplay) as [value, label]}
		<CommandItem
			onSelect={() => {
                onSelect?.(value);
				if (entryIds) {
					$mutation.mutate({
						ids: entryIds,
						status: value,
					});
				}
			}}
		>
			<svelte:component this={statusesWithIcons[value]} class="h-4 w-4 mr-2" />
			{label}
		</CommandItem>
	{/each}
</CommandGroup>
