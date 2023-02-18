import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel, CompleteAnnotation, AnnotationModel } from "./index"

export const _AnnotationColorModel = z.object({
  color: z.string(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  id: z.string(),
  userId: z.string(),
})

export interface CompleteAnnotationColor extends z.infer<typeof _AnnotationColorModel> {
  user: CompleteUser
  annotations: CompleteAnnotation[]
}

/**
 * AnnotationColorModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const AnnotationColorModel: z.ZodSchema<CompleteAnnotationColor> = z.lazy(() => _AnnotationColorModel.extend({
  user: UserModel,
  annotations: AnnotationModel.array(),
}))
