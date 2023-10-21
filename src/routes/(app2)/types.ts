import type { z } from "zod";

// type QueryFn = <TSchema extends z.ZodTypeAny>() => {
//     staleTime: number;
//     fn: ({ input, ctx }: { input: z.infer<TSchema>; ctx: { userId: string } }) => Promise<any>;
//     schema?: TSchema;
// }

export interface Query<I extends z.ZodTypeAny> {
    staleTime: number;
    fn: (args: { input: z.infer<I>, ctx: any }) => Promise<any>;
    schema: I;
}

