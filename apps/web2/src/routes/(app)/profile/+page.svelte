<!-- plan: let's get it working, then add effect rx + replicache and eventaully xstate -->
<script lang="ts">
	import { Replicache } from 'replicache';
	import { useRx, useRxValue } from './rx.svelte';
	import * as Entries from './Entries';
	import { Option } from 'effect';
	let userId = 'n0za7qlnp1rca3s';
	// let rep = new Replicache({
	// 	name: userId,
	// 	licenseKey: 'ld43a69e6baa14a1a85eb6bb09661739e',
	// 	pullURL: 'http://0.0.0.0:3000/sync/pull',
	// 	pushURL: 'http://0.0.0.0:3000/sync/push',

	//     auth: 'Bearer mnywTdF8-3wdpuCz4lj-ZFiY6',
	// 	logLevel: 'debug'
	// });
	// rep.getAuth = () => {
	//     console.log('get auth')
	//     return null
	// }

	const entries = useRxValue(Entries.effect);
	const subscriptionRef = useRxValue(Entries.subscriptionRef);
	// TODO: how to make waiting work...
	console.log('waiting', entries.waiting);
	console.log({ entries });
	console.log({ subscriptionRef });
</script>

{#if entries._tag === 'Success'}
	{entries.value.data?.length} entries
	{#each entries.value.data ?? [] as entry}
		<p>
			{Option.filter(entry.title, (s) => s.length > 0).pipe(Option.getOrElse(() => 'no title'))}
		</p>
	{/each}
{/if}
