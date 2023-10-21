import { z } from "zod";


export const tagIdsSchema = z.array(z.number());

export const idSchema = z.object({
    id: z.string()
});

export const idOptionalArraySchema = z.object({
    id: z.union([z.string(), z.array(z.string())])
});

export * from './bookmark';
export * from "./form";
