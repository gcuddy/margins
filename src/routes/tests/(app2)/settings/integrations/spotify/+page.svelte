<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';

	import { enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Spotify } from '$lib/features/services/spotify-user';

	// spotify logic (maybe split into own route)
	// check url for spotify access tokens

	export let data;

    $: spotifyIntegration = data.spotify
	const spotify = writable<Spotify | null>(null);

	$: $spotify = spotifyIntegration?.accessToken
		? new Spotify(spotifyIntegration.accessToken)
		: null;

	// TODO: could this data be stored elsewhere?
	const spotifyProfileQuery = createQuery(
		derived(spotify, ($spotify) => ({
			enabled: !!$spotify,
			queryFn: async () => $spotify?.get<SpotifyApi.UserObjectPrivate>('/me'),
			queryKey: ['spotify-profile'],
			staleTime: 0,
		})),
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Spotify</Card.Title>
		<Card.Description>
			Integrate Margins with your Spotify account.
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-1">
			{#if spotifyIntegration}
				{#if $spotifyProfileQuery.data}
					Connected as {$spotifyProfileQuery.data.display_name}
				{:else if $spotifyProfileQuery.isError}
					Error: {$spotifyProfileQuery.error}
				{:else if $spotifyProfileQuery.isLoading}
					Loading...
				{/if}
				<div>
					<Button href="/tests/settings/integrations/spotify/import">Import</Button>
				</div>
				<form use:enhance method="post" action="?/removeIntegration">
					<input type="hidden" name="serviceName" value="spotify" />
					<Button variant="secondary" type="submit">Disconnect</Button>
				</form>
			{:else}
				<Button variant="secondary" href="/api/spotify/login">Connect</Button>
			{/if}
		</div>
		<!-- {#if spotifyIntegration}
			<form use:enhance action="?/removeIntegration">
				<input type="hidden" name="serviceName" value="spotify" />
				<Button variant="secondary" href="/api/spotify/login">Connect</Button>
			</form>
		{:else}
			<Button variant="secondary" href="/api/spotify/login">Connect</Button>
		{/if}
		{#if spotifyIntegration}
			<pre>
            {JSON.stringify(spotifyIntegration, null, 2)}
        </pre>
		{/if} -->
	</Card.Content>
</Card.Root>
