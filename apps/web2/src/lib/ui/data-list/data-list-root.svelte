<script lang="ts">
	import { dataListRoot, type DataListProps } from '$lib/ui/data-list/data-list.props';
	import Text from '$lib/ui/text.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setContext } from 'svelte';

	interface Props extends DataListProps, HTMLAttributes<HTMLDListElement> {}

	let { children, orientation, size, trim, class: className }: Props = $props();

	setContext("DataList.Root.Orientation", orientation)
</script>

<Text>
	{#snippet child({ props })}
		<dl {...props} class={dataListRoot({ className: [props.className, className], orientation, size, trim })}>
			{@render children?.()}
		</dl>
	{/snippet}
</Text>
