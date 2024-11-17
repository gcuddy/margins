import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"
import { Entry, EntryId, EntryNotFound } from "../Domain/Entry.js"
import { Unauthorized } from "../Domain/Actor.js"

export class EntriesApi extends HttpApiGroup.make("entries")
  .add(
    HttpApiEndpoint.get("getEntry", "/entries/:id")
      .setPath(Schema.Struct({ id: EntryId }))
      .addSuccess(Entry.json)
      .addError(EntryNotFound)
      .addError(Unauthorized)
    // TODO: auth if entry is private
  ) { }
