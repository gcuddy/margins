<script lang="ts" generics="A, E">
	import type { Result, Rx } from '@effect-rx/rx';
	import { useRxValue } from '../profile/rx.svelte';
	import type { Snippet } from 'svelte';

	let {
		rx,
		options,
		children
	}: {
		rx: Rx.Rx<Result.Result<A, E>>;
		options?: { readonly suspendOnWaiting?: boolean };
		children: Snippet<[Result.Success<A, E>]>;
	} = $props();

	const result = useRxValue(rx);

	// TODO: handle errors
	const tag = $derived(result._tag);

</script>

{#if result._tag === 'Success'}
	{@render children(result)}
{/if}
