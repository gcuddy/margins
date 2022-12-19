<script lang="ts">
	import type { ChosenIcon } from '$lib/types/icon';
	import Icon from './helpers/Icon.svelte';
	export let chosenIcon: ChosenIcon;
</script>

{#if chosenIcon.type === 'icon'}
	<Icon
		style="color: {chosenIcon.color};"
		name={chosenIcon.name}
		className="h-4 w-4 fill-current"
	/>
{:else if chosenIcon.type === 'emoji'}
	<div>{chosenIcon.emoji}</div>
{/if}
