import * as z from "zod"
import * as imports from "../zod-utils"
import { Color } from "@prisma/client"
import { CompleteUser, UserModel } from "./index"

export const _ColorDescriptionModel = z.object({
  userId: z.string(),
  color: z.nativeEnum(Color),
  description: z.string().nullish(),
})

export interface CompleteColorDescription extends z.infer<typeof _ColorDescriptionModel> {
  user: CompleteUser
}

/**
 * ColorDescriptionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const ColorDescriptionModel: z.ZodSchema<CompleteColorDescription> = z.lazy(() => _ColorDescriptionModel.extend({
  user: UserModel,
}))
