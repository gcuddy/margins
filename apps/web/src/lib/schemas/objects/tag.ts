import { z } from "zod";

export const tagSchema = z.object({
    id: z.number(),
    name: z.string(),
})
