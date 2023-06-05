<script lang="ts">
	import type { CssClasses } from "$lib";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLAttributes, HTMLBaseAttributes, HTMLFormAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };

	type TType = $$Generic<string | undefined>

	export let as = 'div' as TType;

	type HTMLProps = TType extends 'form' ? HTMLFormAttributes : HTMLBaseAttributes;

	type $$Props = HTMLProps & {
		class?: string;
		content?: CssClasses;
		as?: TType;
	}


</script>

<svelte:element this={as}
	{...$$restProps}
	class={cn(
		"rounded-lg border bg-card text-card-foreground shadow-sm",
		className
	)}
>
	<!--  -->
	<slot />
</svelte:element>
