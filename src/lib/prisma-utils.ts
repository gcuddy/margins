import type { Entry, Prisma } from "@prisma/client";
import type { z } from "zod";
import type { SmartListCondition } from "./types/filter";
import type { EntryWhereInputObjectSchema } from "./zod/schemas";



export const EntryWhereToFilter = (items: Entry[], filters: SmartListCondition[], and: "AND" | "OR" | "NOT") => {
    items.filter(item => filters.every(f => {
        if (f.field in item) {
            const key = f.field as keyof typeof item
            if (f.type === "StringFilter") {
                switch (f.filter) {
                    case "contains": {
                        return (item[key] as string).toLowerCase().includes(f.value.toLowerCase());
                    }
                    case "startsWith": {
                        return (item[key] as string).toLowerCase().startsWith(f.value.toLowerCase());
                    }
                    case "endsWith": {
                        return (item[key] as string).toLowerCase().endsWith(f.value.toLowerCase());
                    }
                    case "equals": {
                        return (item[key] as string).toLowerCase().toLowerCase() === (f.value).toLowerCase();
                    }
                }
            }
        }
    }))
}