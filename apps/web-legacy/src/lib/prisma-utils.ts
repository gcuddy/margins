import type { Entry, Prisma } from "@prisma/client";
import type { z } from "zod";
import type { SmartListCondition } from "./types/filter";
s


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

type Nullable<T> = T | null;

// TODO: how to figure out when it's an Enum?
// take in todo and apply filters to it 
type TODO<T> = {
    [K in keyof T]?: T[K] extends Nullable<Date> ? Prisma.DateTimeFilter<T> : T[K] extends Nullable<String> ? Prisma.StringNullableFilter<T> : T[K] extends Nullable<Number> ? Prisma.IntNullableFilter<T> : never;
}

type GenericFilter<T> = TODO<T> & {
    AND?: Prisma.Enumerable<TODO<T>>;
    OR?: Prisma.Enumerable<TODO<T>>;
    NOT?: Prisma.Enumerable<TODO<T>>;
}

export const genericPrismaWhereToFilter = <T>(items: T[], filter: TODO<T>, and: "AND" | "OR" | "NOT") => {

    let itemSet = new Set([...items]);

    for (let key in filter) {
        if (["AND", "OR", "NOT"].includes(key)) {
            // process
        }
        items.forEach(item => {
            if (item[key]) {
                console.log(item[key])
            }
        })
    }

    if ("AND" in filter) {
        and
    }

    // items.filter(item => filters.every(f => {
    //     if (f.field in item) {
    //         const key = f.field as keyof typeof item
    //         if (f.type === "StringFilter") {
    //             switch (f.filter) {
    //                 case "contains": {
    //                     return (item[key] as string).toLowerCase().includes(f.value.toLowerCase());
    //                 }
    //                 case "startsWith": {
    //                     return (item[key] as string).toLowerCase().startsWith(f.value.toLowerCase());
    //                 }
    //                 case "endsWith": {
    //                     return (item[key] as string).toLowerCase().endsWith(f.value.toLowerCase());
    //                 }
    //                 case "equals": {
    //                     return (item[key] as string).toLowerCase().toLowerCase() === (f.value).toLowerCase();
    //                 }
    //             }
    //         }
    //     }
    // }))
}

const a = [{
    a: "a",
    b: new Date()
},
{
    a: "b",
    b: new Date()
}
]

// genericPrismaWhereToFilter(a, {
//     a: {
//         contains: "test"
//     },
//     b: {
//         equals: new Date()
//     }
// })