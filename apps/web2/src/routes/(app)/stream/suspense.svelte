<script lang="ts" generics="A, E">
	import type { Result, Rx } from '@effect-rx/rx';
	import { useRxValue } from '../profile/rx.svelte';
	import type { Snippet } from 'svelte';

	let {
		rx,
		children,
		fallback
	}: {
		rx: Rx.Rx<Result.Result<A, E>>;
		options?: { readonly suspendOnWaiting?: boolean };
		children: Snippet<[Result.Success<A, E>]>;
		fallback?: Snippet;
	} = $props();
	const result = useRxValue(rx);
	$inspect(result);
</script>

{#if result._tag === 'Success'}
	{@render children(result)}
{:else if result._tag === 'Initial' && fallback}
	{@render fallback()}
{/if}
