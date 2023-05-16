import { annotationSchema } from "$lib/annotation";
import { z } from "zod";


export const note_schema = annotationSchema.extend({
    title: z.string().nullish(),
    type: z.literal("document").default("document"),
    references: z.array(z.coerce.number()).default([])
})

export type NoteSchema = typeof note_schema;
