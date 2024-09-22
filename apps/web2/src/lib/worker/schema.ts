import { Schema } from '@effect/schema';
// import { Entry } from '@margins/api2/src/Domain/Entry';

export class SearchError extends Schema.TaggedError<SearchError>()('SearchError', {}) {}

export class Search extends Schema.TaggedRequest<Search>()('Search', {
	payload: {
		q: Schema.String
	},
	// replicache keys - should type as such
	success: Schema.Array(Schema.String),
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
