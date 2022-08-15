<script lang="ts">
	import type { Action } from '$lib/actions/types';

	import type { MenuItem } from '$lib/types/schemas/Menu';

	import ContextMenu from './ContextMenu.svelte';
	import Icon from './helpers/Icon.svelte';

	export let items: MenuItem[][] = [];
	export let icons: 'solid' | 'outline' = 'solid';
	export let actions: Action[] = [];
</script>

<ContextMenu {items} {icons} buttonActions={actions}>
	<Icon name="dotsHorizontalSolid" className="h-4 w-4 fill-gray-600 dark:fill-gray-300" />
</ContextMenu>
