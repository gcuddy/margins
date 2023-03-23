<script lang="ts">
	import { PUBLIC_SPOTIFY_CLIENT_ID } from "$env/static/public";
	import type { PageData } from "./$types";
	let wrapper;
	export let data: PageData;
</script>

<h1>Spotify</h1>

{data.accessToken}

<!-- <WebPlayback client_id={PUBLIC_SPOTIFY_CLIENT_ID} bind:this={wrapper}>
	<div slot="all" let:player let:state let:error let:internal>
		<button on:click={wrapper.login}>login</button>
		{JSON.stringify(internal)}
		{JSON.stringify(state)}
		{JSON.stringify(error)}
		{JSON.stringify(player)}
	</div>
</WebPlayback> -->
