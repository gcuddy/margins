import { z } from "zod";


export const tagIdsSchema = z.array(z.number());

export const idSchema = z.object({
    id: z.string()
});

export * from "./form";
