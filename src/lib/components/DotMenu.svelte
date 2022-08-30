<script lang="ts">
	import type { Action } from '$lib/actions/types';
	import type { PopperPlacement } from '$lib/types';

	import type { MenuItem } from '$lib/types/schemas/Menu';

	import ContextMenu from './ContextMenu.svelte';
	import Icon from './helpers/Icon.svelte';

	export let items: MenuItem[][] = [];
	export let icons: 'solid' | 'outline' = 'solid';
	export let actions: Action[] = [];
	export let placement: PopperPlacement = 'bottom-end';
	export let strategy: 'fixed' | 'absolute' = 'fixed';
	export let overlayClass = '';
</script>

<ContextMenu {items} {icons} buttonActions={actions} {placement} {strategy} {overlayClass}>
	<Icon name="dotsHorizontalSolid" className="h-4 w-4 fill-gray-600 dark:fill-gray-300" />
</ContextMenu>
