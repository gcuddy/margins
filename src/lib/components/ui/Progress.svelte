<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";

	// port of https://github.com/radix-ui/primitives/blob/main/packages/react/progress/src/Progress.tsx
	//  and shadcn

	interface $$Props extends HTMLBaseAttributes {
		value?: number | null;
		max?: number;
		getValueLabel?: (value: number, max: number) => string;
		class?: string;
	}
	export let max = 100;
	export let value: $$Props["value"] = undefined;
	export let getValueLabel: $$Props["getValueLabel"] = (value, max) =>
		`${Math.round((value / max) * 100)}%`;
	let className = "";
	export { className as class };
</script>

<div
	aria-valuemax={max}
	aria-valuemin={0}
	aria-valuenow={value}
	aria-valuetext={value ? getValueLabel?.(value, max) : undefined}
	role="progressbar"
	{...$$restProps}
	class={cn(
		"relative h-4 w-full overflow-hidden rounded-full bg-secondary",
		className
	)}
>
	<!-- todo: fix value -->
	<div
		class="h-full w-full flex-1 bg-primary transition-all"
		style:transform="translateX(-{100 - (value || 0)}%)"
	/>
</div>
