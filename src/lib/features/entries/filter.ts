

import { DocumentType } from "@prisma/client";
import { z } from "zod";

import { useTypedQuery } from "$lib/stores/typedQuery";

// move to zod-utils
export const filterQuerySchema = z.object({
    // TODO: just use findmany from entry
    type: z.nativeEnum(DocumentType),
    // published: 
});


export function useFilterQuery() {
    return useTypedQuery(filterQuerySchema)
}