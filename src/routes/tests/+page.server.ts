import type parse from "$lib/parse";
import { add_url_schema, urlSchema, validateAuthedForm } from "$lib/schemas";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import { db, json } from '$lib/db'
import { normalizeUrl } from "$lib/feeds/utils";
import { getFirstBookmarkSort } from "$lib/db/selects";
import { allowedThemes } from "$lib/features/settings/themes";
import { nanoid } from "$lib/nanoid";
import { dev } from "$app/environment";

const themes = allowedThemes;

export const actions: Actions = {
    // This action is called when the user clicks the theme button
    setTheme: async ({ url, cookies, request }) => {

        const theme = url.searchParams.get("theme") ?? (String((await request.formData()).get("theme")))
        const redirectTo = url.searchParams.get("redirectTo");

        console.log({ theme, redirectTo })

        if (!theme || !themes.includes(theme)) {
            return fail(400)
        }

        console.log('theme')

        if (theme) {
            cookies.set("theme", theme, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365,
                secure: dev ? false : true,
            })
        }
        if (redirectTo) {
            throw redirect(303, redirectTo ?? "/");
        }
    },
    addUrl: validateAuthedForm(add_url_schema, async ({ form, fetch, session }) => {
        const { url, status, via_entryid, via_url } = form.data;
        // check if url is isbn
        const is_isbn = /^(\d{10}|\d{13})$/.test(url);

        const uri = is_isbn ? `isbn:${url}` : normalizeUrl(url)
        let entryId: number;
        // try selecting the entry first
        const existing_entry = await db.selectFrom("Entry")
            .select("id")
            .where("uri", "=", uri)
            .executeTakeFirst();
        if (existing_entry) {
            console.log({ existing_entry })
            entryId = Number(existing_entry.id);
        } else {
            const res = await fetch(`/api/parse/${encodeURIComponent(uri)}`)
            if (!res.ok) {
                return fail(500, {
                    message: res.statusText
                })
            }
            const { url: _url, ...rest } = await (res.json() as ReturnType<typeof parse>);
            const entry = await db.insertInto("Entry")
                .values({
                    updatedAt: new Date(),
                    // ...data,
                    ...rest,
                    podcastIndexId: rest.podcastIndexId ? Number(rest.podcastIndexId) : null,
                    original: rest.original ? json(rest.original) : null,
                    uri,
                })
                .ignore()
                .executeTakeFirst();
            console.log({ entry })
            entryId = Number(entry.insertId);
        }
        if (!entryId) {
            return fail(500, {
                message: "Could not create or retrieve entry"
            })
        }
        const promises = [];
        console.log({ via_entryid })
        if (via_entryid) {
            // create relation
            const add_relation = async () => {
                const relation = await db.insertInto("Relation")
                    .values({
                        entryId,
                        relatedEntryId: via_entryid,
                        updatedAt: new Date(),
                        type: "SavedFrom",
                        userId: session.userId,
                        id: nanoid()
                    })
                    .ignore()
                    .execute();
                console.log({ relation })
            }
            promises.push(add_relation())
        }

        // create bookmark
        const add_bookmark = async () => {
            const sort_order = await getFirstBookmarkSort(session.userId)
            await db.insertInto("Bookmark")
                .values({
                    userId: session.userId,
                    entryId,
                    updatedAt: new Date(),
                    sort_order,
                    status
                })
                .ignore()
                .execute();
        }
        promises.push(add_bookmark())

        await Promise.all(promises);

        throw redirect(303, "/tests/library/backlog");
    })
};