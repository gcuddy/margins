/* eslint-disable require-yield */
import { Replicache } from './Replicache';
import { Effect } from 'effect';
import { Schema } from '@effect/schema';
import type { ParseError } from '@effect/schema/ParseResult';

export const makeReplicacheRepository = <S extends Schema.Schema.Any>(
	model: S,
	prefix: string
): Effect.Effect<
	{
		readonly scan: () => Effect.Effect<S['Type'][], ParseError, never>;
	},
	never,
	never
> =>
	Effect.gen(function* () {
		const replicache = yield* Replicache;

		// TODO: make this use Effect.Stream
		const scan = () =>
			Effect.gen(function* () {
				// let data = $state<T[]>([]);
				const decode = Schema.decodeUnknown(Schema.Array(model));
				// TODO: how to derive prefix type from Model maybe?
				// TODO: use experimentalWatch for better performance
				// see my existing code
				// replicache.subscribe()
				const data = $state<S['Type'][]>([]);

				return data;
			});

		return {
			scan
		} as const;
	});
