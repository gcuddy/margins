import { Schema } from "@effect/schema"
import {
  GoogleBookVolume,
  GoogleBookVolumes,
} from "./integrations/google-books/schema"

export class GoogleBooksSearch extends Schema.TaggedRequest<GoogleBooksSearch>()(
  "GoogleBooksSearch",
  {
    failure: Schema.String, // Indicates that no errors are expected
    success: GoogleBookVolumes, // Specifies that the response is an array of Users
    payload: {
      query: Schema.String,
    },
  },
) {}

export class GoogleBooksGet extends Schema.TaggedRequest<GoogleBooksGet>()(
  "GoogleBooksGet",
  {
    failure: Schema.String, // Indicates that no errors are expected
    success: GoogleBookVolume, // Specifies that the response is an array of Users
    payload: {
      id: Schema.String,
    },
  },
) {}
