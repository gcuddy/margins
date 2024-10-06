<script lang="ts" generics="A">
	import { Option } from 'effect';

	import type { Snippet } from 'svelte';

	let {
		option,
		some,
		none
	}: {
		option: Option.Option<A>;
		some: Snippet<[A]>;
		none: Snippet;
	} = $props();
</script>

{#if Option.isSome(option)}
	{@render some(option.value)}
{:else if none}
	{@render none()}
{/if}
