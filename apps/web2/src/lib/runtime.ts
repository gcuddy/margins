import { FetchHttpClient } from '@effect/platform';
import { Layer, ManagedRuntime } from 'effect';

const layer = Layer.mergeAll(FetchHttpClient.layer);

export const runtime = ManagedRuntime.make(layer);
