import { browser } from "$app/environment";

// Map for localStorage keys
export const LOCALSTORAGE_KEYS = {
	accessToken: "spotify_access_token",
	refreshToken: "spotify_refresh_token",
	expireTime: "spotify_token_expire_time",
	timestamp: "spotify_token_timestamp",
};

// Map to retrieve localStorage values
export const LOCALSTORAGE_VALUES = {
	accessToken: browser && window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
	refreshToken: browser && window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
	expireTime: browser && window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
	timestamp: browser && window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
const hasTokenExpired = () => {
	const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
	if (!accessToken || !timestamp) {
		return false;
	}
	const millisecondsElapsed = Date.now() - Number(timestamp);
	return millisecondsElapsed / 1000 > Number(expireTime);
};

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async () => {
	try {
		console.log("trying refresh");
		// // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
		if (
			!LOCALSTORAGE_VALUES.refreshToken ||
			LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
			Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
		) {
			console.error("No refresh token available");
			logout();
		}

		// // Use `/refresh_token` endpoint from our Node app
		const data = await fetch(
			`/api/spotify/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
		).then((res) => res.json());
		console.log({ data });

		// // Update localStorage values
		// window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
		// window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now().toString());

		// // Reload the page for localStorage updates to be reflected
		// window.location.reload();
	} catch (e) {
		console.error(e);
	}
};

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
	// Clear all localStorage items
	for (const property in LOCALSTORAGE_KEYS) {
		window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
	}
	// Navigate to homepage
	window.location = window.location.origin;
};
export const getAccessToken = () => {
	if (!browser) return false;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const queryParams = {
		[LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
		[LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
		[LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
	};
	const hasError = urlParams.get("error");

	// If there's an error OR the token in localStorage has expired, refresh the token
	if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === "undefined") {
		refreshToken();
	}

	// If there is a valid access token in localStorage, use that
	if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== "undefined") {
		return LOCALSTORAGE_VALUES.accessToken;
	}

	// If there is a token in the URL query params, user is logging in for the first time
	if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
		// Store the query params in localStorage
		for (const property in queryParams) {
			window.localStorage.setItem(property, queryParams[property]);
		}
		// Set timestamp
		window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
		// Return access token from query params
		return queryParams[LOCALSTORAGE_KEYS.accessToken];
	}

	// We should never get here!
	return false;
};

export class Spotify {
	headers: RequestInit["headers"];
	baseUrl: string = "https://api.spotify.com/v1";
	constructor(private accessToken: string) {
		this.accessToken = accessToken;
		this.headers = {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		};
	}

	getAccessToken() {
		return this.accessToken;
	}

	async get<T>(path: `/${string}`): Promise<T | undefined> {
		try {
			const response = await fetch(`${this.baseUrl}${path}`, {
				headers: this.headers,
			});
			return await response.json();
		} catch (e) {
			console.error(e);
		}
	}
}
