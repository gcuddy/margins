import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteStylesheet, StylesheetModel } from "./index"

export const _UserEntryModel = z.object({
  id: z.number().int(),
})

export interface CompleteUserEntry extends z.infer<typeof _UserEntryModel> {
  Stylesheet: CompleteStylesheet[]
}

/**
 * UserEntryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const UserEntryModel: z.ZodSchema<CompleteUserEntry> = z.lazy(() => _UserEntryModel.extend({
  Stylesheet: StylesheetModel.array(),
}))
