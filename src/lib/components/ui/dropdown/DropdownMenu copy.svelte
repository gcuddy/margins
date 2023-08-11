<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import type { ComponentType } from 'svelte';

	// TODO radio groups etc;

	type Item = {
		name: string;
		icon?: ComponentType;
		action?: () => void;
		href?: string;
		checked?: boolean;
		items?: Item[];
	};
	export let items: Item[][] = [];

	const {
		elements: { trigger, menu, separator, item },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true
	});
</script>

<slot trigger={$trigger} name="trigger" />

{#if $open}
	<div use:melt={$menu}>
		{#each items as group, index}
			{#each group as menuItem}
				<div use:melt={$item}>
					{menuItem.name}
				</div>
			{/each}
		{/each}
	</div>
{/if}
