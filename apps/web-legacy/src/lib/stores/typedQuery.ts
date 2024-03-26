import { derived, Readable, writable } from "svelte/store";
import { z } from "zod";

import { page } from "$app/stores";

type OptionalKeys<T> = { [K in keyof T]-?: Record<string, unknown> extends Pick<T, K> ? K : never }[keyof T];

type FilteredKeys<T, U> = { [K in keyof T as T[K] extends U ? K : never]: T[K] };

// Take array as a string and return zod array
export const queryNumberArray = z
    .string()
    .or(z.number())
    .or(z.array(z.number()))
    .transform((a) => {
        if (typeof a === "string") return a.split(",").map((a) => Number(a));
        if (Array.isArray(a)) return a;
        return [a];
    });

// Take array as a string and return zod  number array

// Take string and return return zod string array - comma separated
export const queryStringArray = z
    .preprocess((a) => z.string().parse(a).split(","), z.string().array())
    .or(z.string().array());

export function useTypedQuery<T extends z.ZodTypeAny>(schema: T) {
    type Output = z.infer<typeof schema>;
    type FullOutput = Required<Output>;
    type OutputKeys = Required<keyof FullOutput>;
    type OutputOptionalKeys = OptionalKeys<Output>;
    type ArrayOutput = FilteredKeys<FullOutput, Array<unknown>>;
    type ArrayOutputKeys = keyof ArrayOutput;

    //   TODO: queryparams, see discussion on shallow routing https://github.com/sveltejs/kit/issues/2673
    // const { query: unparsedQuery, ...router } = useRouter();
    // const parsedQuerySchema = schema.safeParse(unparsedQuery);

    const { subscribe, set, update} = writable<Output[]>([])

    const parsedQueryStore: Readable<Output | undefined> = derived(page, ($page) => {
        const parsed = schema.safeParse(Object.fromEntries($page.url.searchParams));
        if (parsed.success) return parsed.data;
        else if (!parsed.success) console.error(parsed.error);
    })

    // push item to existing key
    function pushItemToKey<J extends ArrayOutputKeys>(key: J, value: ArrayOutput[J][number]) {

        const existingValue = parsedQuery[key];
        if (Array.isArray(existingValue)) {
            if (existingValue.includes(value)) return; // prevent adding the same value to the array
            // @ts-expect-error this is too much for TS it seems
            setQuery(key, [...existingValue, value]);
        } else {
            // @ts-expect-error this is too much for TS it seems
            setQuery(key, [value]);
        }
    }

    return {
        data: parsedQueryStore,
        subscribe,
        set,
        update
    }

}


