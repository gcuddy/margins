import { HttpClient, HttpClientRequest } from '@effect/platform';
import { RpcResolver } from '@effect/rpc';
import { HttpRpcResolver } from '@effect/rpc-http';
import { Effect } from 'effect';
import type { Router } from '@margins/api2/src/Rpc/Router';

export const makeClient = Effect.gen(function* () {
	const baseClient = yield* HttpClient.HttpClient;
	const client = baseClient.pipe(
		HttpClient.mapRequest(HttpClientRequest.prependUrl('http://0.0.0.0:3030/rpc'))
	);
	return HttpRpcResolver.make<Router>(client).pipe(RpcResolver.toClient);
});
