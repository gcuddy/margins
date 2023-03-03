import Spotify from "spotify-web-api-node";

import { SPOTIFY_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_SPOTIFY_CLIENT_ID } from "$env/static/public";

export const spotify = new Spotify({
	clientId: PUBLIC_SPOTIFY_CLIENT_ID,
	clientSecret: SPOTIFY_CLIENT_SECRET,
});

spotify.clientCredentialsGrant().then((data) => {
	spotify.setAccessToken(data.body["access_token"]);
});
