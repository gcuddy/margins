<script lang="ts">
	import { dataListItem, type DataListItemProps } from '$lib/ui/data-list/data-list.props';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getContext } from 'svelte';
	interface Props extends DataListItemProps, HTMLAttributes<HTMLDListElement> {}

	let { children, orientation: orientationProp, align, class: className }: Props = $props();

	const orientationCtx = getContext('DataList.Root.Orientation') as typeof orientationProp;

	const orientation = orientationProp ?? orientationCtx;
</script>

<div class={dataListItem({ className, orientation, align })}>
	{@render children?.()}
</div>
