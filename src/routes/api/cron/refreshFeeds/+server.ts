// This NEEDS to be authenticated

import { error, json } from "@sveltejs/kit";

import { CRON_KEY } from "$env/static/private";
import { db } from "$lib/db";
import { refresh } from "$lib/jobs/refresher";
import { redis } from "$lib/redis";

import type { RequestHandler } from "./$types";


/**
 * @template T
 * @param {T[]} array
 * @param {number} size
 * @returns {T[][]}
 */
function chunk<T>(array: T[], size = 10) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr;
}


export const POST: RequestHandler = async ({ request, url, fetch }) => {
    const apiKey = request.headers.get("authorization");
    if (CRON_KEY !== apiKey) {
        throw error(401, {
            message: "Not authenticated",
        });
    }

    // check in redis if this is already running
    // if so, return
    // else, set redis key to true
    // run jo

    const isRunning = await redis.get("refreshFeeds:isRunning");
    // if (isRunning) {
    //     return json({ message: "Already run in last 30 minutes." });
    // }
    // await redis.set("refreshFeeds:isRunning", true, {
    //     // expire in 30 minutes
    //     ex: 60 * 30,
    // });

    // TODO: authenticate request
    // request.headers.get("Authorization")

    console.time(`[refreshFeeds]`);


    const ids = url.searchParams.get("ids");
    console.log({ids})
    try {
        if (ids) {
            const feed_ids = ids.split(",").map(id => Number(id));
            console.log({feed_ids})
            const count = await refresh({ feed_ids });
            console.log(`refreshed ${count} feeds`)
        } else {
            // chunk
            const feeds = await db.feed.findMany({
                where: {
                    active: true,
                    subscriptions: {
                        some: {},
                    },
                    // TODO: allow passing in full feeds instead of ids to prevent extra db call
                },
            })
            const chunked = chunk(feeds, 10);
            console.log(chunked.length  + " chunks")
            for (const chunk of chunked) {
                const feed_ids = chunk.map(f => f.id);
                console.log({feed_ids})
                await fetch(`/api/cron/refreshFeeds?ids=${feed_ids.join(",")}`, {
                    method: "POST",
                    headers: {
                        "Authorization": CRON_KEY,
                    }
                })
            }
            // const count = await refresh({});
            // console.log(`refreshed ${count} feeds`)
        }
        console.timeEnd(`[refreshFeeds]`);
        return json({ message: "success" });
    } catch (e) {
        throw error(500, {
            message: "Error refreshing. Check logs.",
        });
    }


    // TODO: cache last refreshed and make sure it isn't overworking

    // can this happen in background? If I return a response without awaiting does it still work on Vercel?

    // TODO: for each X feeds, create job/queue with qstash
    // create fanout functions
    // create queue
    // create job



    // 10s

};
