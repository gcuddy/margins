<script lang="ts">
	import './segmented-control.css';
	import { ToggleGroup, type ToggleGroupRootProps } from 'bits-ui';
	import {
		segmentedControlVariants,
		type SegmentedControlProps
	} from './segmented-control.props.js';
	import type { Snippet, ComponentProps } from 'svelte';

	let {
		children,
		value = $bindable(),
		class: className,
		size,
		variant
	}: {
		children: Snippet;
		value?: string;
		class?: string;
		size?: SegmentedControlProps['size'];
		variant?: SegmentedControlProps['variant'];
	} = $props();
</script>

<ToggleGroup.Root
	bind:value
	type="single"
	class={segmentedControlVariants({ className, size, variant })}
>
	{@render children()}
	<div class="rt-SegmentedControlIndicator"></div>
</ToggleGroup.Root>
