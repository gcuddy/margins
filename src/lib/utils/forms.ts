import { type RequestEvent, fail, type ActionResult } from "@sveltejs/kit";
import type { Session } from 'lucia';
import type { z } from "zod";

export const post = async <TBody extends Record<string, string | number | boolean>>(action: string, body?: TBody) => {
    console.log({ action, body })
    const data = new FormData();
    Object.entries(body || {}).forEach(([key, value]) => {
        console.log({ key, value })
        if (key && value) data.append(key, value.toString());
    });
    console.log({ data })
    const response = await fetch(action, {
            method: "POST",
            headers: {
                'x-sveltekit-action': 'true',
            },
            body: data
        })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return await response.json() as ActionResult;
}


export function validate_form<TSchema extends z.ZodTypeAny, TRequestEvent extends RequestEvent = RequestEvent>(schema: TSchema, handler: (data: TRequestEvent & {
    data: z.infer<TSchema>,
    session: Session
}) => any): (event: TRequestEvent) => Promise<any> {
    //
    return async (event) => {
        const session = await event.locals.validate();
        if (!session) {
            return fail(401)
        }
        const form = await event.request.formData();


        // TODO: this doesn't support scalar string arrays
        const data = Object.fromEntries(form.entries());

        const parsed = schema.safeParse(data);

        if (!parsed.success) {
            return fail(422, {
                data,
                errors: parsed.error.issues
            })
        }

        return await handler({
            ...event,
            session,
            data
        })
    }
}
