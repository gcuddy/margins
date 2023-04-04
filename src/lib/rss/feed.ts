import Parser from "rss-parser";
import { db } from "$lib/db"
const parser = new Parser();

export async function getFeed(url: string) {
    const text = await fetch(url).then((res) => res.text());
    // TODO: json feed
    const feed = await parser.parseString(text);
    return feed;
}

type ParserOutput = Parser.Output<{ [key: string]: any; }>

export async function addFeedToDb(feed: ParserOutput) {
    const { title, description, link, feedUrl, items, image, itunes } = feed;
    const result = await db.insertInto("Feed")
        .values({
            title,
            description,
            link,
            feedUrl,
            imageUrl: image?.url,
            updatedAt: new Date(),
            podcast: !!itunes
        })
        .executeTakeFirstOrThrow();
    return result.insertId as number | undefined;
}
