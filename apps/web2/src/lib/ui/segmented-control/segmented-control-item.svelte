<script lang="ts">
	import { ToggleGroup } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let { children, value }: { children: Snippet; value: string } = $props();
</script>

<ToggleGroup.Item {value} class="rt-reset rt-SegmentedControlItem">
	<span class="rt-SegmentedControlItemSeparator"></span>
	<span class="rt-SegmentedControlItemLabel">
		<span class="rt-SegmentedControlItemLabelActive">{@render children()}</span>
		<span class="rt-SegmentedControlItemLabelInactive">{@render children()}</span>
	</span>
</ToggleGroup.Item>
