import { z } from "zod";

import { TargetSchema } from "$lib/annotation";
import { chosenIcon } from "$lib/types/icon";
import { recipeSchema } from "$lib/web-parser/recipe";
export { ViewOptionsSchema } from "$lib/types/schemas/View";

export { chosenIcon, recipeSchema, TargetSchema };
export * from "$lib/web-parser/schemaOrg";
export const StringNullableFilter = z.object({
    equals: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    notIn: z.array(z.string()).nullish(),
    lt: z.string(),
    lte: z.string(),
    gt: z.string(),
    gte: z.string(),
    contains: z.string(),
    startsWith: z.string(),
    endsWith: z.string(),
    search: z.string(),
    not: z.string().nullish() // <-- not using nested filter here to simplify
});

export const StringFilterToDisplay: Record<keyof Pick<typeof StringNullableFilter["shape"], "contains" | "equals" | "startsWith" | "endsWith" | "search" | "not">, string> = {
    equals: "equals",
    contains: "contains",
    startsWith: "starts with",
    endsWith: "ends with",
    search: "search",
    not: "not",
} as const;

// export type IntNullableFilter = {
//     equals?: number | null
//     in?: Enumerable<number> | null
//     notIn?: Enumerable<number> | null
//     lt?: number
//     lte?: number
//     gt?: number
//     gte?: number
//     not?: NestedIntNullableFilter | number | null
//   }

export const IntNullableFilter = z.object({
    equals: z.number().nullish(),
    in: z.array(z.number()).nullish(),
    notIn: z.array(z.number()).nullish(),
    lt: z.number(),
    lte: z.number(),
    gt: z.number(),
    gte: z.number(),
    not: z.number().nullish() // <-- not using nested filter here to simplify
});

export const EntryExtendedSchema = z.object({
    outgoingLinks: z.array(z.object({
        href: z.string(),
        text: z.string()
    })),
    authorUrl: z.string().nullish(),
}).partial();
