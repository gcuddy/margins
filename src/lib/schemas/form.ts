import { type RequestEvent, fail } from "@sveltejs/kit";
import type { Session } from 'lucia';
import type { UnwrapEffects, Validation, ZodValidation } from "sveltekit-superforms";
import { superValidate } from "sveltekit-superforms/server";
import { type AnyZodObject, z } from "zod";

type SuperValidateParams = Parameters<typeof superValidate>;

// function validateAuthedForm<TSchema extends ZodValidation<AnyZodObject>, TRequestEvent extends RequestEvent = RequestEvent>(schema: TSchema, opts: SuperValidateParams[2], handler: (data: TRequestEvent & {
//     form: Validation<UnwrapEffects<TSchema>, any>
// }) => any): any;

// function validateAuthedForm<TSchema extends ZodValidation<AnyZodObject>, TRequestEvent extends RequestEvent = RequestEvent>(schema: TSchema, handler: (data: TRequestEvent & {
//     form: Validation<UnwrapEffects<TSchema>, any>
// }) => any): any;

export function validateAuthedForm<TSchema extends ZodValidation<AnyZodObject>, TRequestEvent extends RequestEvent = RequestEvent>(schema: TSchema, handler: (data: TRequestEvent & {
    form: Validation<UnwrapEffects<TSchema>, any>,
    session: Session
}) => any): (event: TRequestEvent) => Promise<any>; // Overload 1

export function validateAuthedForm<TSchema extends ZodValidation<AnyZodObject>, TRequestEvent extends RequestEvent = RequestEvent>(schema: TSchema, opts: SuperValidateParams[2], handler: (data: TRequestEvent & {
    form: Validation<UnwrapEffects<TSchema>, any>,
    session: Session
}) => any): (event: TRequestEvent) => Promise<any>; // Overload 2


export function validateAuthedForm<TSchema extends ZodValidation<AnyZodObject>, TRequestEvent extends RequestEvent = RequestEvent>(schema: TSchema, optsOrHandler: SuperValidateParams[2] | ((data: TRequestEvent & {
    form: Validation<UnwrapEffects<TSchema>, any>,
    session: Session
}) => any), handler?: (data: TRequestEvent & {
    form: Validation<UnwrapEffects<TSchema>, any>,
    session: Session
}) => any) {
    return async (event: TRequestEvent) => {
        // TODO: conditionally auth
        const session = await event.locals.auth.validate();
        console.log({ session })
        if (!session) {
            return fail(401);
        }
        let opts: SuperValidateParams[2] | undefined;

        if (typeof optsOrHandler === 'function') {
            handler = optsOrHandler;
        } else {
            opts = optsOrHandler;
        }

        const form = await superValidate(event, schema, opts);

        console.dir({ form }, {
            depth: null
        })

        if (!form.valid) {
            // should this not be called here?
            return fail(400, { form })
        }

        return await handler!({
            ...event,
            form,
            session
        })
    }
}

export const isbn_regex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;

export const urlSchema = z.object({
    url: z.string().url().or(z.string().regex(isbn_regex)),
})

export const add_url_schema = urlSchema.extend({
    status: z.enum(["Backlog", "Now", "Archive"]).default("Backlog"),
    via_url: z.string().url().optional(),
    via_entryid: z.number().optional(),
})
export type AddUrlObj = z.infer<typeof add_url_schema>

export const nameSchema = z.object({
    name: z.string().min(1).max(100),
})

function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
    if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
    } else {
        return new Date(mOrTimestamp);
    }
}

export const bulkEntriesSchema = z.object({
    ids: z.array(z.number()),
    data: z.object({
        status: z.enum(["Backlog", "Now", "Archive"]),
        // ...etc
    })
})


export type BulkEntries = typeof bulkEntriesSchema;

export const interactionSchema = z.object({
	entryId: z.number(),
	started: z.coerce.date().nullish(),
	finished: z.coerce.date().nullish(),
	id: z.number().optional(),
	title: z.string().min(1).max(100).nullish(),
	note: z.string().min(1).max(255).nullish(),
	currentPage: z.coerce.number().int().nullish(),
	progress: z.coerce.number().min(0).max(1).nullish(),
});

export type InteractionSchema = typeof interactionSchema;
