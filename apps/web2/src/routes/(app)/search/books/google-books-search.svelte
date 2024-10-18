<script lang="ts">
	import { makeClient } from '$lib/rpc';
	import { runtime } from '$lib/runtime';
	import { GoogleBooksSearch } from '@margins/api2/src/Rpc/Integrations/GoogleBooks/schema';
	import { Effect } from 'effect';

	let { query }: { query: string } = $props();

	const main = (query: string) =>
		Effect.gen(function* () {
			const client = yield* makeClient;
			console.log('running main for query', { query });
			const volumes = yield* client(
				new GoogleBooksSearch({
					query
				})
			).pipe(Effect.tapErrorCause(Effect.logError));
			console.log({ volumes });
			return volumes;
		});

	const promise = $derived(runtime.runPromise(main(query)));
</script>

{#await promise}
	Loading...
{:catch error}
	{JSON.stringify(error)}
{:then volumes}
	{JSON.stringify(volumes)}
{/await}
