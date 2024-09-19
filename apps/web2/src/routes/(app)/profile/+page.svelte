<!-- plan: let's get it working, then add effect rx + replicache and eventaully xstate -->
<script lang="ts">
	import { Replicache } from 'replicache';
	let userId = 'n0za7qlnp1rca3s';
	let rep = new Replicache({
		name: userId,
		licenseKey: 'ld43a69e6baa14a1a85eb6bb09661739e',
		pullURL: 'http://0.0.0.0:3000/sync/pull',
		pushURL: 'http://0.0.0.0:3000/sync/push',

        auth: 'Bearer igem6vuap5rokewxe3vlrrefgzd22lawf73p2pcv'
	});
    rep.getAuth = () => {
        console.log('get auth')
        return null
    }

	$effect(() => {
		const a = rep.subscribe(
			async (tx) => {
				const entries = await tx.scan({ prefix: 'entries/' }).entries().toArray();
				console.log({ entries });
				return entries;
			},
			(items) => {
				console.log({ items });
			}
		);
	});
</script>
