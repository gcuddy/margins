import { z } from "zod";

export const cursorInput = z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
})