import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteEntryData, EntryDataModel, CompleteEntry, EntryModel } from "./index"

export const _EntryMediaModel = z.object({
  id: z.number().int(),
  url: z.string().nullish(),
  size: z.number().int().nullish(),
  duration: z.number().int().nullish(),
  type: z.string().nullish(),
  title: z.string().nullish(),
  documentDataId: z.number().int(),
  entryId: z.number().int().nullish(),
})

export interface CompleteEntryMedia extends z.infer<typeof _EntryMediaModel> {
  DocumentData: CompleteEntryData
  Entry?: CompleteEntry | null
}

/**
 * EntryMediaModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const EntryMediaModel: z.ZodSchema<CompleteEntryMedia> = z.lazy(() => _EntryMediaModel.extend({
  DocumentData: EntryDataModel,
  Entry: EntryModel.nullish(),
}))
