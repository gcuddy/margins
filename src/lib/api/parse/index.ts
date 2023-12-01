import { dev } from '$app/environment';
import { redis } from '$lib/redis';
import _parse from '$lib/parse';
export async function parse(url: string) {
	const cached = await redis.get(url);
	if (cached && !dev) {
		const data = cached as Awaited<ReturnType<typeof _parse>>;
		return data;
	}

	return _parse(url);
}
