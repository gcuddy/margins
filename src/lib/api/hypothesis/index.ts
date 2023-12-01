import type * as H from './types';
export type { H };
export { SERVICE_NAME } from './constants';

export class HypothesisApi {
	readonly baseUrl = 'https://hypothes.is/api';
	private token: string;
	private userId?: string;

	constructor(token: string, userId: string | undefined = undefined) {
		this.token = token;
		this.userId = userId;
	}

	private getHeaders() {
		return {
			AUTHORIZATION: `Bearer ${this.token}`,
			Accept: 'application/json',
		};
	}

	async getProfile() {
		const response = await fetch(`${this.baseUrl}/profile`, {
			headers: this.getHeaders(),
		});
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		const data = (await response.json()) as H.HypothesisProfile;
		this.userId = data.userid;
		return data;
	}

	async getAnnotations(limit = 200, userId?: string) {
		if (userId) this.userId = userId;
		if (!this.userId) {
			// hm
			await this.getProfile();
		}
		const url = new URL(`${this.baseUrl}/search`);
		const params = new URLSearchParams({
			user: this.userId!,
			limit: limit.toString(),
			sort: 'updated',
			order: 'desc',
			// search_after:
		});
		url.search = params.toString();

		const response = await fetch(url, {
			headers: this.getHeaders(),
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = (await response.json()) as H.HypothesisSearchResponse;

		console.log({ url, data });

		return data.rows;
	}
}
