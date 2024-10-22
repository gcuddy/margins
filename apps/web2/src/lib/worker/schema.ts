import { Schema } from '@effect/schema';
import { Entry } from '@margins/api2/src/Domain/Entry';
// import { Entry } from '@margins/api2/src/Domain/Entry';

export class SearchError extends Schema.TaggedError<SearchError>()('SearchError', {}) {}

export const makeOramaSchema = <S extends Schema.Schema.AnyNoContext>(schema: S) =>
	Schema.Struct({
		elapsed: Schema.Struct({
			raw: Schema.Number,
			formatted: Schema.String
		}),
		count: Schema.Number,
		hits: Schema.Array(
			Schema.Struct({
				id: Schema.String,
				score: Schema.Number,
				document: schema
			})
		)
	});

export class Search extends Schema.TaggedRequest<Search>()('Search', {
	payload: {
		q: Schema.String
	},
	// replicache keys - should type as such
	// success: makeOramaSchema(Entry),
	success: makeOramaSchema(
		Schema.Struct({
			title: Schema.NullishOr(Schema.String),
			author: Schema.NullishOr(Schema.String),
			text: Schema.NullishOr(Schema.String),
			image: Schema.NullishOr(Schema.String)
		})
	),
	// success: Schema.Array(Entry),
	failure: SearchError
}) {}

export class InitialMessage extends Schema.TaggedRequest<InitialMessage>()('InitialMessage', {
	payload: {},
	success: Schema.Void,
	failure: Schema.Never
}) {}

export const Requests = Schema.Union(Search, InitialMessage);
export type Requests = Schema.Schema.Type<typeof Requests>;
