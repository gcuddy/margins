import { annotationSchema } from "$lib/annotation"
import { validateAuthedForm } from "$lib/schemas.js"
import { superValidate } from "sveltekit-superforms/server"
import { z } from "zod";
import { db } from "$lib/db"
import { nanoid } from "$lib/nanoid";
import { note_schema } from "../schema";
import { redirect } from "@sveltejs/kit";

export async function load() {
    const form = superValidate(note_schema)
    return {
        form
    }
}

export const actions = {
    default: validateAuthedForm(note_schema, async ({ form, session }) => {
        let { id: _id, references, ...data } = form.data;
        console.log("data", {
            data,
        })
        let id = _id || nanoid()
        const note = await db.insertInto("Annotation")
            .values({
                ...data,
                id,
                userId: session.userId,
            })
            .onDuplicateKeyUpdate(data)
            .executeTakeFirst();
        if (!references.length) {
            await db.deleteFrom("annotation_to_entry_reference")
                .where("annotationId", "=", id)
                .execute()

        } else {
            await db.insertInto("annotation_to_entry_reference")
                .values(references.map(ref => ({
                    entryId: ref,
                    annotationId: id,
                })))
                .ignore()
                .execute()

            // delete any references that are no longer valid
            await db.deleteFrom("annotation_to_entry_reference")
                .where("annotationId", "=", id)
                .where("entryId", "not in", references)
                .execute()
        }
        console.log("note", note);
        throw redirect(302, '/tests/notes/' + id)
    })
}