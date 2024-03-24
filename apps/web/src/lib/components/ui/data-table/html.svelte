<script lang="ts">
	import SimpleClamp from "$components/simple-clamp.svelte";
	import type { ComponentProps } from "svelte";

	export let html: string;
    let className: string | null | undefined = undefined
    export { className as class };
    export let clamp: ComponentProps<SimpleClamp> | undefined = undefined;
</script>

{#if clamp}
    <SimpleClamp {...clamp}>
        <div class={className}>
            {@html html}
        </div>
    </SimpleClamp>
{:else}
<div class={className}>
	{@html html}
</div>
{/if}
