import { annotationSchema } from "$lib/annotation";
import { db, json } from "$lib/db";
import { bookmarkSchema, tagSchema, updateBookmarkSchema } from '$lib/features/entries/forms';
import { nanoid } from "$lib/nanoid";
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import { getMovieDetailsFromApi, tmdb } from '$lib/api/tmdb';
import { books } from '$lib/api/gbook';
import pindex from '$lib/api/pindex';
import type { Insertable } from "kysely";
import type { Entry, Person } from "$lib/prisma/kysely/types";
import type { Message } from "$lib/types";
import dayjs from "$lib/dayjs";



export const load = (async (event) => {
    const { id, type } = event.params;

    const session = await event.locals.validate();

    console.time("entry");

    let podcast: ReturnType<(typeof pindex)["episodeById"]> | null = null;


    let query = db.selectFrom("Entry")
        .select(["id", "title", "html", "author"])
        .$if(!!session, q => q.select(eb => [
            jsonArrayFrom(eb.selectFrom("Annotation")
                .select(["Annotation.id", "Annotation.contentData"])
                .whereRef("Annotation.entryId", "=", "Entry.id")
                .where("Annotation.userId", "=", session!.userId)
                .orderBy("Annotation.createdAt", "asc")).as("annotations"),
            jsonArrayFrom(eb.selectFrom("Collection as c")
                .select(["c.id", "c.contentData"])
                .innerJoin("CollectionItems as ci", "ci.collectionId", "c.id")
                .whereRef("ci.entryId", "=", "Entry.id")
                .where("c.userId", "=", session!.userId)
            ).as("collections"),
            jsonArrayFrom(eb.selectFrom("Relation as r")
                .innerJoin("Entry as e", "e.id", "r.relatedEntryId")
                .select(["r.entryId", "r.type", "e.title as related_entry_title", "e.id as related_entry_id",])
                .whereRef("r.entryId", "=", "Entry.id")
                .where("r.userId", "=", session!.userId)
            ).as("relations"),
            jsonArrayFrom(eb.selectFrom("TagOnEntry as toe")
                .innerJoin("Tag as t", "t.id", "toe.tagId")
                .select(["t.id", "t.name"])
                .whereRef("toe.entryId", "=", "Entry.id")
                .where("toe.userId", "=", session!.userId)
            )
                .as("tags"),
            jsonObjectFrom(eb.selectFrom("Bookmark")
                .select(["id", "status"])
                .whereRef("Bookmark.entryId", "=", "Entry.id")
                .where("Bookmark.userId", "=", session!.userId)
            ).as("bookmark"),
        ]))

    switch (type) {
        case "movie":
            query = query
                .where("Entry.tmdbId", "=", +id)
                .where("Entry.type", "=", "movie");
            break;
        case "tv":
            query = query
                .where("Entry.tmdbId", "=", +id)
                .where("Entry.type", "=", "tv");
            break;
        case "book":
            query = query
                // .where("Entry.uri", "=", `isbn:${id}`);
                .where("Entry.googleBooksId", "=", id);
            break;
        case "podcast": {
            // if id starts with p, this indicates it's a pointer to the podcastindexid
            // else, it's a podcast saved without a podcastindexid (i.e. a private podcast or something of the sort)
            const podcastIndexId = id.startsWith("p") ? id.slice(1) : undefined;
            if (podcastIndexId) {
                query = query
                    .where("Entry.podcastIndexId", "=", BigInt(podcastIndexId));
                podcast = pindex.episodeById(+podcastIndexId);
                break;
            }
        };
        default:
            query = query
                .where("Entry.id", "=", +id);
            break;
    }

    const entry = await query
        .executeTakeFirst();

    console.timeEnd("entry");

    const tagForm = superValidate({
        tags: entry?.tags
    }, tagSchema, { id: "tag" });

    const updateBookmarkForm = superValidate<typeof updateBookmarkSchema, Message>(entry?.bookmark, updateBookmarkSchema, { id: "update" });

    const annotationForm = superValidate({
        entryId: entry?.id,
    }, annotationSchema, { id: "annotation" });

    const bookmarkForm = superValidate({
        id: entry?.bookmark?.id,
        entryId: entry?.id,
        tmdbId: type === "movie" || type === "tv" ? +id : undefined,
        googleBooksId: type === "book" ? id : undefined,
        podcastIndexId: type === "podcast" && id.startsWith("p") ? BigInt(id.slice(1)) : undefined,
        //@ts-expect-error
        type,
    }, bookmarkSchema, { id: "bookmark" });

    return {
        tagForm,
        entry,
        updateBookmarkForm,
        bookmarkForm,
        annotationForm,
        type,
        // TODO: move these to endpoint to use in +page.ts with better cachings
        movie: type === "movie" ? tmdb.movie.details(+id) : null,
        book: type === "book" ? books.get(id) : null,
        tv: type === "tv" ? tmdb.tv.details(+id) : null,
        podcast
    };
})

export const actions = {
    updateBookmark: async (e) => {
        const { request, params, locals } = e;
        const session = await locals.validate();
        if (!session) {
            return fail(401)
        }
        const form = await superValidate<typeof updateBookmarkSchema, Message>(request, updateBookmarkSchema, { id: "update" });
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
        return message(form, {
            status: "success",
            text: "Status updated to " + status
        })
    },
    bookmark: async ({ request, params, locals }) => {
        const session = await locals.validate();
        if (!session) {
            return fail(401)
        }
        const { type } = params;
        const bookmarkForm = await superValidate(request, bookmarkSchema, { id: "bookmark" });

        let entryId = type === "entry" ? +params.id : bookmarkForm.data.entryId;

        if (!entryId) {
            // then we need to create the entry first
            const { entryId: _entryId, id, ...data } = bookmarkForm.data;
            // TODO: get tmdb or googlebooks data or whatever...

            let insertable: Insertable<Entry> = {
                updatedAt: new Date(),
                ...data,
            }

            if ((type === "movie" || type === "tv") && data.tmdbId) {
                if (type === "tv") {
                    const tv = await tmdb.tv.details(data.tmdbId);
                    insertable = {
                        ...insertable,
                        title: tv.name,
                        text: tv.overview,
                        uri: `tmdb:tv:${tv.id}`,
                        tmdbId: tv.id,
                        author: tv.created_by?.map(val => val.name).join(", "),
                        published: tv.first_air_date,
                        image: tmdb.media(tv.poster_path),
                        type: "tv",
                    }
                } else {
                    const movie = await tmdb.movie.details(data.tmdbId);
                    insertable = {
                        ...insertable,
                        title: movie.title,
                        html: movie.overview,
                        uri: `tmdb:${movie.id}`,
                        tmdbId: movie.id,
                        author: movie.credits?.crew?.find(c => c.job === "Director")?.name,
                        published: movie.release_date,
                        image: tmdb.media(movie.poster_path),
                        type: "movie",
                    }
                }
            } else if (type === "book" && data.googleBooksId) {

                const book = await books.get(data.googleBooksId);
                console.log({ book })
                let image = book.volumeInfo.imageLinks?.thumbnail;
                if (image) {
                    const u = new URL(image);
                    u.searchParams.delete("edge");
                    image = u.toString();
                }

                insertable = {
                    ...insertable,
                    title: book.volumeInfo.title,
                    html: book.volumeInfo.description,
                    uri: `isbn:${book.volumeInfo.industryIdentifiers?.find(i => i.type === "ISBN_13")?.identifier}`,
                    googleBooksId: book.id,
                    author: book.volumeInfo.authors?.join(", "),
                    published: dayjs(book.volumeInfo.publishedDate).toDate(),
                    image,
                    type: "book",
                }
            } else if (type === "podcast" && data.podcastIndexId) {
                //todo
                const { episode } = await pindex.episodeById(Number(data.podcastIndexId));
                insertable = {
                    ...insertable,
                    title: episode.title,
                    text: episode.description,
                    uri: episode.enclosureUrl,
                    podcastIndexId: BigInt(episode.id),
                    published: new Date(episode.datePublished * 1000),
                    type: "podcast",
                    image: episode.image || episode.feedImage,
                }
            }
            const entry = await db.insertInto("Entry")
                .values(insertable)
                .executeTakeFirst();
            entryId = Number(entry.insertId)
        }
        console.log({ bookmarkForm })
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
                    entryId,
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
        const a = await db.insertInto("Annotation")
            .values({
                id,
                ...annotation,
                target: annotation.target ? json(annotation.target) : undefined,
                userId: session.userId,
            })
            .onDuplicateKeyUpdate({
                ...annotation,
                target: annotation.target ? json(annotation.target) : undefined,
                userId: session.userId,
            })
            .execute();
        console.dir({ a }, { depth: null });
        console.log({ annotationForm })
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

