import { annotationSchema } from "$lib/annotation";
import { db } from "$lib/db";
import { bookmarkSchema, tagSchema, updateBookmarkSchema } from '$lib/features/entries/forms';
import { nanoid } from "$lib/nanoid";
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';



export const load = (async (event) => {
    const { params, } = event;
    const { id } = params;
    const bookmarkForm = superValidate(event, bookmarkSchema, { id: "bookmark" });
    // const form = superValidate();
    return {
        bookmarkForm,
    };
});

export const actions = {
    updateBookmark: async (e) => {
        const { request, params, locals } = e;
        const session = await locals.validate();
        if (!session) {
            return fail(401)
        }
        const form = await superValidate(request, updateBookmarkSchema, { id: "update" });
        console.log({ form })
        if (!form.valid) {
            return fail(400, { update: form })
        }
        const { status } = form.data;
        await db.updateTable("Bookmark")
            .where("entryId", "=", +params.id)
            .where("userId", "=", session.userId)
            .set({
                status
            })
            .execute();
        return message(form, "Bookmark updated")
    },
    bookmark: async ({ request, params, locals }) => {
        const session = await locals.validate();
        if (!session) {
            return fail(401)
        }
        const bookmarkForm = await superValidate(request, bookmarkSchema, { id: "bookmark" });

        if (bookmarkForm.data.id) {
            // then delete
            await db.deleteFrom("Bookmark")
                .where("id", "=", bookmarkForm.data.id)
                .execute();
            return message(bookmarkForm, "Bookmark deleted")
        } else {
            // then create
            await db.insertInto("Bookmark")
                .values({
                    updatedAt: new Date(),
                    entryId: +params.id,
                    userId: session.userId
                })
                .execute();
            return message(bookmarkForm, "Bookmark created")
        }
        // return {
        //     bookmarkForm
        // }
    },
    annotate: async ({ request, params, locals }) => {
        const session = await locals.validate();
        if (!session) {
            return fail(401)
        }
        const annotationForm = await superValidate(request, annotationSchema, { id: "annotation" });
        console.dir({ annotationForm }, {
            depth: null
        });
        let { id, ...annotation } = annotationForm.data;
        if (!id) {
            id = nanoid();
        }
        await db.insertInto("Annotation")
            .values({
                id,
                ...annotation,
                userId: session.userId,
            })
            .onDuplicateKeyUpdate({
                ...annotation,
            })
            .execute();
        return message(annotationForm, "Annotation saved")
    },
    tag: async ({ request, params, locals }) => {
        const session = await locals.validate();
        if (!session) {
            return fail(401)
        }
        const tagForm = await superValidate(request, tagSchema, { id: "tag" });
        console.dir({ tagForm }, {
            depth: null
        });
        if (!tagForm.valid) {
            return fail(400, { tagForm })
        }

        // then we have an array of tags
        const tagsToAdd = tagForm.data.tags.filter(tag => !tag.id);
        let tagIds = tagForm.data.tags.filter(tag => tag.id).map(tag => tag.id).filter(Boolean);
        console.log({ tagsToAdd, existingTagIds: tagIds })
        if (!tagIds.length) {
            // then delete all existing tags on this entry 
            await db.deleteFrom("TagOnEntry")
                .where("entryId", "=", +params.id)
                .execute();
            return message(tagForm, "Tags updated")
        }
        // if (tagsToAdd.length) {
        //     await db.insertInto("Tag")
        //         .values(tagsToAdd.map(tag => ({
        //             name: tag.name,
        //             userId: session.userId,
        //         })))
        //         .execute();

        //     // get ids of new tags
        //     const newTags = await db.selectFrom("Tag")
        //         .select(["id"])
        //         .where("userId", "=", session.userId)
        //         .where("name", "in", tagsToAdd.map(tag => tag.name))
        //         .execute();

        //     existingTagIds = [...existingTagIds, ...newTags.map(tag => tag.id)]
        // }
        // now update tag on entry
        const q = await db.insertInto("TagOnEntry")
            .values(tagIds.map(tagId => ({
                entryId: +params.id,
                tagId,
                userId: session.userId,
            })))
            .ignore()
            .execute();
        console.dir({ q }, { depth: null })
        // now delete tags that are no longer there
        await db.deleteFrom("TagOnEntry")
            .where("entryId", "=", +params.id)
            .where("tagId", "not in", tagIds)
            .execute();




        // TODO: use string ids to make this more efficient
        return message(tagForm, "Tags added")



        // old version below that wanted tags array - this just wants a
        // // filter tags without ids to add them
        // const tagsToAdd = tagForm.data.tags.filter(tag => !tag.id);
        // const existingTagIds = tagForm.data.tags.filter(tag => tag.id).map(tag => tag.id).filter(Boolean)

        // // add new tags
        // if (tagsToAdd.length) {
        //     console.log({ tagsToAdd })
        //     await db.insertInto("Tag")
        //         .values(tagsToAdd.map(tag => ({
        //             name: tag.name,
        //             userId: session.userId,
        //         })))
        //         .execute();
        // }

        // // get existing tags? (or should this come from client?)
        // const existingTags = await db.selectFrom("Tag as t")
        //     .innerJoin("TagOnEntry as toe", "toe.tagId", "t.id")
        //     .select(["t.id", "t.name", "toe.id as toe_id"])
        //     .where("toe.entryId", "=", +params.id)
        //     .execute();

        // const tagsToRemove = existingTags.filter(tag => !existingTagIds.includes(tag.id));
        // if (tagsToRemove.length) {
        //     // remove old tags
        //     console.log("tagsToRemove", tagsToRemove)
        //     const tagIdsToRemove = tagsToRemove.map(tag => tag.id);
        //     await db.deleteFrom("TagOnEntry")
        //         .where("entryId", "=", +params.id)
        //         .where("tagId", "in", tagIdsToRemove)
        //         .execute();
        // }

        // // New tags:

        // // now update tag on entries


        // const tags = tagForm.data.tags.map(tag => ({
        //     name: tag.name,
        //     id: tag.id ?? nanoid(),
        //     userId: session.userId,
        // }) as const)
        // // await db.insertInto("Tag")
        // //     .values(tags)
    },
    createTag: async ({ request, url, params, locals }) => {
        console.log({ request, url, search: url.search })

        const session = await locals.validate();
        if (!session) {
            return fail(401)
        }
        const name = url.searchParams.get("name");
        if (name) {
            const q = await db.insertInto("Tag")
                .values({
                    name,
                    userId: session.userId,
                })
                .executeTakeFirstOrThrow();
            const id = Number(q.insertId);
            await db.insertInto("TagOnEntry")
                .values({
                    entryId: +params.id,
                    tagId: id,
                    userId: session.userId,
                })
                .execute();
            // return message({ id, name }, "Tag created")
            // return {
            //     id,
            //     name,
            // }
        }
    }
}

