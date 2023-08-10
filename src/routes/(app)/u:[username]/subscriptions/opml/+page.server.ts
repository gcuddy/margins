import { addSubscription } from "$lib/feeds/parser";
import { type Actions, fail } from "@sveltejs/kit";
import { XMLParser } from "fast-xml-parser";
import { z } from "zod";

// import { addFeed } from "../../rss/utils";

const opmlObject = z.object({
    opml: z.object({
        body: z.object({
            outline: z.array(
                z.object({
                    text: z.string(),
                    title: z.string(),
                    type: z.string().optional(),
                    xmlUrl: z.string().optional(),
                })
            ),
        }),
    }),
});

export const actions: Actions = {
    submitOpml: async ({ request }) => {
        console.log("opml request");
        const data = await request.formData();
        const opml = data.get("opml") as Blob;
        const rawOpml = await opml.text();
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });
        const parsed = parser.parse(rawOpml);
        try {
            const validated = opmlObject.parse(parsed);
            console.log({ validated });
            return validated;
        } catch (e) {
            console.error(e);
            return fail(400, {
                parsed,
                message: "Invalid OPML",
            });
        }
    },
    submitUrls: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            return fail(401, {
                message: "Not logged in",
            });
        }
        const data = await request.formData();
        const obj = Object.fromEntries(data);
        const urlKeys = Object.keys(obj).filter((k) => k.startsWith(`url`));
        const toAdd = urlKeys.map((key) => {
            const [k, index] = key.split(":");
            const url = obj[key] as string;
            const title = obj[`title:${index}`] as string;
            return {
                url,
                title,
            };
        });
        console.log({ toAdd });
        const addedFeeds = await Promise.all(
            toAdd.map(async ({ url, title }) => addSubscription({ feedUrl: url, title, userId: session.user.userId }))
        );
        // Promise.all(
        // 	urls.map(async (url) =>
        // 		addFeed({
        // 			url,
        // 			userId: session.user.userId,
        // 		})
        // 	)
        // );
    },
};
