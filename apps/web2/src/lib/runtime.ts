import { Replicache } from '$lib/services/Replicache';
import { FetchHttpClient } from '@effect/platform';
import { Layer, ManagedRuntime } from 'effect';

const layer = Layer.mergeAll(FetchHttpClient.layer, Replicache.Default);

export const runtime = ManagedRuntime.make(layer);
