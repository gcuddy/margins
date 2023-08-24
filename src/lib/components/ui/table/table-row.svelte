<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLTableRowElement> & {
        "data-state"?: unknown;
        "data-highlighted"?: unknown;
        "data-id"?: unknown;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<tr
	class={cn(
		"border-b transition-colors hover:bg-muted/50 data-[highlighted=true]:bg-muted/50 data-[state=selected]:bg-muted",
		className
	)}
    on:mouseover
	{...$$restProps}
>
	<slot />
</tr>
