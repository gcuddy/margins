<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";

	// import { spotify } from "$lib/features/services/spotify";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import { getAccessToken, logout, Spotify } from "$lib/features/services/spotify-user";
	import { createQuery } from "@tanstack/svelte-query";
	import type { PageData } from "./$types";

	export let data: PageData;

	$: access_token = getAccessToken();

	let spotify = new Spotify("");
	$: if (typeof access_token === "string" && access_token) spotify = new Spotify(access_token);

	$: profileQuery = createQuery({
		queryKey: ["spotify-profile"],
		queryFn: () => spotify.get<SpotifyApi.UserObjectPrivate>("/me"),
		enabled: !!access_token,
	});

	// let spotify = new Spotify("");
	// $: if (typeof access_token === "string") spotify = new Spotify(access_token);
	// $: profile = spotify.get("/me")
	// $: profile =
	// $: access_token = $page.url.searchParams.get("access_token");
</script>

<h1>Spotify</h1>

<!-- {data.accessToken} -->

{#if !access_token}
	<a href="/api/spotify/login">Login</a>
{:else}
	<div class="flex justify-between">
		{#if $profileQuery.isLoading}
			Loading...
		{:else if $profileQuery.isError}
			Error: {$profileQuery.error}
		{:else if $profileQuery.isSuccess && $profileQuery.data}
			<div class="flex items-center gap-2">
				<Muted class="text-sm"
					>Connected as <span class="font-medium"> {$profileQuery.data.display_name}</span></Muted
				>
				{#if $profileQuery.data?.images?.length}
					<img class="h-10 w-10 rounded-full" src={$profileQuery.data.images[0].url} />
				{/if}
			</div>
		{/if}
		<button on:click={logout}>Logout</button>
	</div>
{/if}
