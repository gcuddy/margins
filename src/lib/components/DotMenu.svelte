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
	export let offset: [number, number] | undefined = undefined;
	export let overlayClass = '';
	let cls = '';
	export { cls as class };
</script>

<ContextMenu
	class={cls}
	{items}
	{icons}
	{offset}
	buttonActions={actions}
	{placement}
	{strategy}
	{overlayClass}
>
	<Icon name="ellipsisHorizontalMini" className="h-4 w-4 fill-gray-600 dark:fill-gray-300" />
</ContextMenu>
