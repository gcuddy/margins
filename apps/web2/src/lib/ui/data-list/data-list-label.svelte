<script lang="ts">
	import { dataListLabel, type DataListLabelProps } from '$lib/ui/data-list/data-list.props';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getContext } from 'svelte';
	interface Props extends DataListLabelProps, HTMLAttributes<HTMLDListElement> {}

	let { children, orientation: orientationProp, color, class: className }: Props & {
		color?: AccentColor
	} = $props();

	const orientationCtx = getContext('DataList.Root.Orientation') as typeof orientationProp;

	const orientation = orientationProp ?? orientationCtx;
</script>

<dt data-accent-color={color} class={dataListLabel({ className, orientation })}>
	{@render children?.()}
</dt>
