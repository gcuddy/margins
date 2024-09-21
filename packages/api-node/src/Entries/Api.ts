import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "@effect/schema"
import { Entry, EntryId, EntryNotFound } from "../Domain/Entry.js"
import { Unauthorized } from "../Domain/Actor.js"
import { security } from "../Api/Security.js"

export class EntriesApi extends HttpApiGroup.make("entries").pipe(
  HttpApiGroup.add(
    HttpApiEndpoint.get("getEntry", "/entries/:id").pipe(
      HttpApiEndpoint.setPath(Schema.Struct({ id: EntryId })),
      HttpApiEndpoint.setSuccess(Entry.json),
      HttpApiEndpoint.addError(EntryNotFound),
    ),
  ),
  HttpApiGroup.annotateEndpoints(OpenApi.Security, security),
  HttpApiGroup.addError(Unauthorized),
) {}
