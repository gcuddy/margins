import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUserEntry, UserEntryModel, CompleteUser, UserModel } from "./index"

export const _StylesheetModel = z.object({
  id: z.number().int(),
  domain: z.string(),
  css: z.string(),
  userEntryId: z.number().int().nullish(),
  userId: z.string(),
})

export interface CompleteStylesheet extends z.infer<typeof _StylesheetModel> {
  entry?: CompleteUserEntry | null
  user: CompleteUser
}

/**
 * StylesheetModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const StylesheetModel: z.ZodSchema<CompleteStylesheet> = z.lazy(() => _StylesheetModel.extend({
  entry: UserEntryModel.nullish(),
  user: UserModel,
}))
