export class Spotify {
	headers: RequestInit['headers'];
	baseUrl: string = 'https://api.spotify.com/v1';
	constructor(private accessToken: string) {
		this.accessToken = accessToken;
		this.headers = {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
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
			return (await response.json()) as T;
		} catch (error) {
			// eslint-ignore
			console.error(error);
		}
	}
}
