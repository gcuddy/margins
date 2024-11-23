import { Effect } from "effect"

import { Schema, ParseResult } from "effect"

/**
 * @since 1.0.0
 * @category errors
 */
export class ReplicacheApiError extends Schema.TaggedError<ReplicacheApiError>()(
  "ReplicacheApiError",
  {
    message: Schema.String,
  },
) {
  /**
   * @since 1.0.0
   */
  static fromParseError(
    error: ParseResult.ParseError,
  ): Effect.Effect<ReplicacheApiError> {
    return ParseResult.ArrayFormatter.formatError(error).pipe(
      Effect.zip(ParseResult.TreeFormatter.formatError(error)),
      Effect.map(([issues, message]) => new ReplicacheApiError({ message })),
    )
  }
  /**
   * @since 1.0.0
   */
  static refailParseError(
    error: ParseResult.ParseError,
  ): Effect.Effect<never, ReplicacheApiError> {
    return Effect.flatMap(ReplicacheApiError.fromParseError(error), Effect.fail)
  }
}
