<script lang="ts">
	import type { CssClasses } from "$lib";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLAttributes, HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {
		class?: string;
		content?: CssClasses;
	}

</script>

<div
	{...$$restProps}
	class={cn(
		"rounded-lg border bg-card text-card-foreground shadow-sm",
		className
	)}
>
	<!--  -->
	<slot />
</div>
