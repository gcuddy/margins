<script lang="ts">
	import { page } from "$app/stores";
	import type { PageData } from "./$types";
	import { persisted } from "svelte-local-storage-store";

	// import { PUBLIC_TWITTER_API_KEY } from "$env/static/public";
	// import { TwitterApi } from "twitter-api-v2";

	// const client = new TwitterApi({ clientId: PUBLIC_TWITTER_API_KEY });
	// const s = client.generateOAuth2AuthLink($page.url.origin + "/api/twitter/callback");
	// $: console.log({ s });
	export let data: PageData;

	// TODO: persist to db instead of local storage

	// const autoRefresherPlugin = new TwitterApiAutoTokenRefresher({
	// 	refreshToken,
	// 	refreshCredentials: { clientId, clientSecret },
	// 	onTokenUpdate(token) {
	// 		setLoginCredentials(id, token);
	// 	},
	// });

	$: ({ accessToken, refreshToken, expiresIn } = Object.fromEntries($page.url.searchParams));

	$: credentials = persisted("twitter-credentials", {
		accessToken,
		refreshToken,
		expiresIn,
	});
</script>

<a href="/api/twitter/login">Log in</a>
