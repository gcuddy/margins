<script lang="ts">
	import type { PropsWithChildren } from '$lib/utils/types';
	import * as PanePrimitive from 'paneforge';

	type Props = PropsWithChildren<PanePrimitive.PaneGroupProps> & { class?: string };

	let { children, direction, class: className }: Props = $props();
</script>

<PanePrimitive.PaneGroup direction={direction} class={className}>
	{@render children()}
</PanePrimitive.PaneGroup>
