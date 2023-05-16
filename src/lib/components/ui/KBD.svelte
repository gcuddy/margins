<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
    let className = '';
    export { className as class};
    export let modifier: 'command' | 'control' | 'option' | 'shift' | 'super' | undefined = undefined;
    interface $$Props extends HTMLBaseAttributes{
        class?: string;
    }

    const modifier_lookup = {
        'command': '⌘',
        'control': '⌃',
        'option': '⌥',
        'shift': '⇧',
        'super': '⌘'
    }

</script>

<kbd
	class={cn(
        "pointer-events-none h-5 select-none flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100",
        className
    )}
>
{#if modifier}
	<span class="text-xs">⌘</span>{/if}<slot /> 
</kbd>
