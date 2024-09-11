import { Effect } from "effect"

export const make = <S extends Schema.Schema.Any, A, E, R>(
  name: Name,
  mutation: MutationEffect<S, A, E, R>,
) =>
  Effect.gen(function* () {
    yield* Effect.log("hi")
  })

//   desired API: (make(TaggedRequest, mutation))
