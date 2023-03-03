<script lang="ts">
	import { PUBLIC_SPOTIFY_CLIENT_ID } from "$env/static/public";
	import { WebPlayback } from "svelte-spotify-web-playback";
</script>

<!-- 
<svelte:head>
	<script
		async={false}
		defer={true}
		type="text/javascript"
		id="spotify-player-js"
		src="https://sdk.scdn.co/spotify-player.js"
	></script>
</svelte:head> -->

<WebPlayback client_id={PUBLIC_SPOTIFY_CLIENT_ID} />
