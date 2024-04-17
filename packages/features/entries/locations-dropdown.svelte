<script lang="ts">
	import { type Status } from '@margins/db/kysely/enums';

	import {
		locationToDisplay,
		locationToHrefs,
		locationToIcon,
		locations,
	} from './locations';

	import { page } from '$app/stores';
	import { Dropdown, SmallPlus } from '@margins/ui';

	export let status: Status;
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
				href="/u:{$page.data.user?.username}{locationToHrefs[location]}"
			>
				<Dropdown.Icon icon={locationToIcon[location]} />
				{locationToDisplay[location]}</Dropdown.Item
			>
		{/each}
	</Dropdown.Content>
</Dropdown.Root>
