<script lang="ts">
	import { dataListValue, type DataListValueProps } from '$lib/ui/data-list/data-list.props'
	import type { HTMLAttributes } from 'svelte/elements';
	interface Props extends DataListValueProps, HTMLAttributes<HTMLDListElement> {}

	let { children, class: className }: Props= $props();
</script>

<dd class={dataListValue({ className })}>
	{@render children?.()}
</dd>
