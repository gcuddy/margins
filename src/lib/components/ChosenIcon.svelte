<script lang="ts">
	import type { ChosenIcon } from "$lib/types/icon";
	import Icon from "./helpers/Icon.svelte";
	export let chosenIcon: ChosenIcon;
    let c = '';
    export { c as class };
    $: computedClass = chosenIcon?.type === "icon" && !c ? "h-4 w-4 fill-current" : c;
</script>

{#if chosenIcon}
	{#if chosenIcon.type === "icon"}
		<Icon style="color: {chosenIcon.color};" name={chosenIcon.name} className={computedClass} />
	{:else if chosenIcon.type === "emoji"}
		<div class={computedClass}>{chosenIcon.emoji}</div>
	{/if}
{/if}
