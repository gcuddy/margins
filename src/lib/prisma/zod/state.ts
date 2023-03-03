import * as z from "zod"
import * as imports from "../zod-utils"
import { Location } from "@prisma/client"
import { CompleteUser, UserModel, CompleteBookmark, BookmarkModel } from "./index"

export const _StateModel = z.object({
  id: z.number().int(),
  /**
   * Whether or not this state represents things to be looked at later.
   * The name of the state
   */
  name: z.string(),
  /**
   * State's UI color as a hex string
   */
  color: z.string().nullish(),
  /**
   * The type of the state
   */
  type: z.nativeEnum(Location),
  /**
   * The position of the state
   */
  position: z.number(),
  description: z.string().nullish(),
  userId: z.string(),
  default: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteState extends z.infer<typeof _StateModel> {
  user: CompleteUser
  defaultRelation?: CompleteUser | null
  bookmarks: CompleteBookmark[]
}

/**
 * StateModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const StateModel: z.ZodSchema<CompleteState> = z.lazy(() => _StateModel.extend({
  user: UserModel,
  defaultRelation: UserModel.nullish(),
  bookmarks: BookmarkModel.array(),
}))
