<script lang="ts">
	import { type Status } from '@margins/db/kysely/enums';

	import {
		locationToDisplay,
		locationToHrefs,
		locationToIcon,
		locations,
	} from './locations.js';

	import { Dropdown, SmallPlus } from '@margins/ui';
	import { page } from '$app/stores';

	export let status: Status;
	export let onSelect: ((status: Status) => void) | undefined = undefined;
</script>

<Dropdown.Root>
	<Dropdown.Trigger class={Dropdown.triggerVariants()}>
		<svelte:component
			this={locationToIcon[status]}
			class="text-muted-foreground mr-1.5 h-4 w-4"
		/>
		<SmallPlus>
			{status}
		</SmallPlus>
	</Dropdown.Trigger>
	<Dropdown.Content align="start">
		{#each locations as location}
			<Dropdown.Item
				on:click={onSelect ? () => onSelect?.(location) : undefined}
				href={!onSelect
					? `/u:${$page.data.user?.username}${locationToHrefs[location]}`
					: undefined}
			>
				<Dropdown.Icon icon={locationToIcon[location]} />
				{locationToDisplay[location]}</Dropdown.Item
			>
		{/each}
	</Dropdown.Content>
</Dropdown.Root>
