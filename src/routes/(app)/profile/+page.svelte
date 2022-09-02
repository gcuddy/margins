<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: console.log({ data });
	export let promise: Promise<any>;
	$: console.log({ promise });
</script>

<h1>Profile</h1>

<button
	on:click={async () => {
		const res = await fetch('/api/fetch_user_data', {
			headers: {
				Authorization: `Bearer ${data.lucia.access_token}`,
			},
		});
		console.log({ res });
		console.log(await res.json());
	}}>Fetch User Data</button
>

<!-- <pre>
    {#if promise}
		{#await promise then data}
			{JSON.stringify(data, null, 2)}
		{/await}
	{/if}
</pre> -->
