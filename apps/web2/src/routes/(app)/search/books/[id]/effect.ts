import { makeClient } from '$lib/rpc';
import { GoogleBooksGet } from '@margins/api2/src/Rpc/Integrations/GoogleBooks/schema';
import { Effect } from 'effect';

export const main = (id: string) =>
	Effect.gen(function* () {
		const client = yield* makeClient;
		const volumes = yield* client(
			new GoogleBooksGet({
				id
			})
		).pipe(Effect.tapErrorCause(Effect.logError), Effect.withRequestCaching(true));
		return volumes;
	});
