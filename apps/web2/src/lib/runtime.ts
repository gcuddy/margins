import { Replicache } from '$lib/services/Replicache';
import { Pool } from '$lib/worker/client';
import { FetchHttpClient } from '@effect/platform';
import { Layer, ManagedRuntime } from 'effect';

const layer = Layer.mergeAll(FetchHttpClient.layer, Replicache.Default, Pool.Default);

export const runtime = ManagedRuntime.make(layer);
