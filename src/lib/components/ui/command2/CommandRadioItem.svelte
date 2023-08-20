<script lang='ts'>
	import { Circle } from "lucide-svelte";

	import type { ComponentProps } from "svelte";
	import CommandItem from "./CommandItem.svelte";

    type T = $$Generic;
    type $$Props = ComponentProps<CommandItem<T>>;


</script>

<CommandItem class="pl-8" {...$$restProps} let:isSelected>
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		{#if isSelected}
			<Circle class="h-2 w-2 fill-current" />
		{/if}
	</span>
    <slot {isSelected} />
</CommandItem>
