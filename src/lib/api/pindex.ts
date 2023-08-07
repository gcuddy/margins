import { PODCASTINDEX_API_KEY, PODCASTINDEX_API_SECRET } from '$env/static/private';
import type { ApiResponse } from '$lib/features/podcasts/podcastdx';

class PodcastClient {
	private key: string;
	private secret: string;
	private base = 'https://api.podcastindex.org';

	constructor({ key, secret }: { key: string; secret: string }) {
		this.key = key;
		this.secret = secret;
	}

	private async buildHeaders(Key: string) {
		const apiHeaderTime = Math.floor(Date.now() / 1000);
		console.log({ apiHeaderTime, Key, secret: this.secret });
		const data4Hash = Key + this.secret + apiHeaderTime;
		console.log({ data4Hash });
		const encoder = new TextEncoder();
		const data = encoder.encode(data4Hash);
		const hashBuffer = await crypto.subtle.digest('SHA-1', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hash4Header = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		const headers = {
			'Content-Type': 'application/json',
			'X-Auth-Date': `${apiHeaderTime}`,
			'X-Auth-Key': Key,
			Authorization: hash4Header,
			'User-Agent': `Margins/0.1`
		};
		return new Headers(headers);
	}

	private async fetch(endpoint: `/${string}`, params?: Record<string, string | number | boolean>) {
		const url = new URL('/api/1.0' + endpoint, this.base);
		if (params) {
			for (let key in params) {
				const value = params[key];
				url.searchParams.set(key, value.toString());
			}
		}
		console.log(`Fetching ${url.toString()}`);
		return fetch(url, {
			headers: await this.buildHeaders(this.key)
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw new Error(`Error fetching ${url}: ${res.status} ${res.statusText}`);
				}
			})
			.catch((e) => console.error(e));
	}

	async episodeById(
		id: number,
		opts?: {
			fulltext?: boolean;
		}
	) {
		console.time('episodeById');
		const data = await this.fetch('/episodes/byid', {
			id: id.toString(),
			...opts
		});
		console.dir({ data }, { depth: null });
		console.timeEnd('episodeById');
		return data as ApiResponse.EpisodeById;
	}

	/**
	 * This call returns all the episodes we know about for this feed, in reverse chronological order.
	 * Note: The id parameter is the internal Podcastindex id for this feed.
	 */
	async episodesByFeedId(
		id: number | number[],
		opts?: {
			/** You can specify a maximum number of results to return */
			max?: number;
			/** You can specify a hard-coded unix timestamp, or a negative integer that represents a number of seconds prior to right now. Either way you specify, the search will start from that time and only return feeds updated since then. */
			since?: number;
			fulltext?: boolean;
		}
	) {
		const data = await this.fetch('/episodes/byfeedid', {
			id: Array.isArray(id) ? id.join(',') : id.toString(),
			...opts
		});
		return data as ApiResponse.EpisodesByFeedId;
	}

	async podcastById(id: number) {
		const data = await this.fetch('/podcasts/byfeedid', {
			id
		});
		return data as ApiResponse.PodcastById;
	}

	async podcastByItunesId(id: number) {
		const data = await this.fetch('/podcasts/byitunesid', {
			id
		});
		return data as ApiResponse.Podcast;
	}

	async search(q: string) {
		console.log(q);
		const data = await this.fetch('/search/byterm', {
			q
		});
		return data as ApiResponse.Search;
	}
}

const client = new PodcastClient({
	key: PODCASTINDEX_API_KEY,
	secret: PODCASTINDEX_API_SECRET
});

export default client;
