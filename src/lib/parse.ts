import type { books_v1 } from "@googleapis/books";
import type { youtube_v3 } from "@googleapis/youtube";
import { z } from "zod";

import { YOUTUBE_KEY } from "$env/static/private";
import { Parser, type Metadata } from "$lib/web-parser";


import parse from "node-html-parser";
import { uploadFile } from "./backend/s3.server";
import dayjs from "./dayjs";
import { books } from "./features/books/googlebooks.server";
import { spotify } from "./features/services/spotify";
import { twitter } from "./twitter";
import type { Tweet } from "./api/twitter";
import { isbn_regex } from "./schemas";
type VideoListResponse = youtube_v3.Schema$VideoListResponse

const spotifyRegex = /^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/;
const spotifyTypeSchema = z.enum(["track", "album", "playlist"]);

const twitterRegex = /https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;

const googleBooksRegex = /https?:\/\/www\.google\.com\/books\/edition\/.*\/(.*)/;
const googleBooksRegexes = [
    /(?:https?:\/\/books\.google\.com\/books\/about.*?\?id=(?<id>.*))/,
    /(?:https?:\/\/www\.google\.com\/books\/edition\/.*\/(?<id>.*)?\?)/
]

const amazonBooksRegex = /https?:\/\/www\.amazon\.com\/.*\/dp\/(?<id>.*)/;

const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)(?<id>[^"&?/\s]{11})/;


// zod?
type YoutubeJson = {
    title: string;
    author_name: string;
    author_url: string;
    type: "video";
    height: number;
    width: number;
    thumbnail_height: number;
    thumbnail_width: number;
    thumbnail_url: string;
    html: string;
}

function returnBookFromGoogleBook(volume: books_v1.Schema$Volume) {
    return {
        title: volume.volumeInfo?.title,
        author: volume.volumeInfo?.authors?.join(", "),
        image: volume.volumeInfo?.imageLinks?.thumbnail,
        summary: volume.volumeInfo?.description,
        type: "book",
        published: volume.volumeInfo?.publishedDate,
        uri: 'isbn:' + volume.volumeInfo?.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier,
        googleBooksId: volume.id,
    } as const
}


export default async function (url: string, html?: string): Promise<z.infer<typeof Metadata>> {
    const urlObj = new URL(url);
    let htmlToParse = html;
    const bshop = urlObj.hostname.includes("bookshop.org")
    console.log({ bshop })

    // check for isbn
    if (url.startsWith('isbn:')) {
        const isbn = url.replace('isbn:', '');
        const results = await books.search(`isbn:${isbn}`)
        const volume = results.items?.[0];
        if (volume) {
            return returnBookFromGoogleBook(volume);
        }
    }

    if (urlObj.hostname.includes("bookshop.org")) {
        // try bookshop parsing
        if (!htmlToParse) htmlToParse = await fetch(url).then((r) => r.text());
        console.log({ htmlToParse })
        let isbn = /\d{13}/.exec(url)?.[0];
        if (htmlToParse) {
            const doc = parse(htmlToParse);
            if (!isbn) isbn = doc.querySelector('meta[property="book:isbn"]')?.getAttribute("content")
            console.log({ isbn })
            if (isbn) {
                // try to get book from google books
                const results = await books.search(`isbn:${isbn}`)
                const volume = results.items?.[0];
                if (volume) {
                    return returnBookFromGoogleBook(volume);
                }
            }
        }
    }
    if (amazonBooksRegex.test(url)) {
        // try to get isbn from title
        if (!htmlToParse) {
            htmlToParse = await fetch(url).then((r) => r.text());
        }
        if (htmlToParse) {
            const doc = parse(htmlToParse);
            const detailsEl = doc.querySelector(".detail-bullet-list");
            const rawText = detailsEl?.textContent;
            if (rawText) {
                const chunks = rawText.split(":").map(t => t.trim());
                const isbnIndex = chunks.findIndex((t) => t.toLowerCase().includes("isbn-13"));
                const isbn = chunks[isbnIndex + 1].match(/[\d-]+/)?.[0];
                if (isbn) {
                    const results = await books.search(`isbn:${isbn}`);
                    const volume = results.items?.[0];
                    if (volume) {
                        // sorry for this insane nesting mess
                        return returnBookFromGoogleBook(volume);
                    }
                }
            }
        }
    }
    if (url.includes("books.google.com/books/about" || url.includes("google.com/books/edition"))) {
        const regexMatch = googleBooksRegexes.find((r) => r.test(url));
        if (regexMatch) {
            const match = url.match(regexMatch)
            const id = match?.groups?.id;
            if (id) {
                const volume = await books.get(id);
                return returnBookFromGoogleBook(volume);
            }
        }
    }
    if (twitterRegex.test(url)) {
        // extract tweet id

        const [, , , id] = url.match(twitterRegex) || [];
        if (id) {
            const tweet = await twitter.singleTweet(id, {
                expansions: [
                    "author_id",
                    "attachments.media_keys",
                    "in_reply_to_user_id",
                    "referenced_tweets.id",
                    "referenced_tweets.id.author_id",
                    "entities.mentions.username",
                ],
                "media.fields": ["url", "preview_image_url", "type", "alt_text", "duration_ms", "variants"],
                "user.fields": ["name", "username", "profile_image_url"],
                "tweet.fields": [
                    "created_at",
                    "conversation_id",
                    "text",
                    "entities",
                    "public_metrics",
                    "referenced_tweets",
                    "in_reply_to_user_id",
                ],
            }) as Tweet;
            console.dir({ tweet }, { depth: null });
            return {
                title: tweet.data.text.slice(0, 100),
                html: tweet.data.text,
                text: tweet.data.text,
                author: tweet.includes?.users?.[0]?.name,
                published: tweet.data.created_at,
                image: tweet.includes?.media?.[0]?.preview_image_url || tweet.includes?.media?.[0]?.url || null,
                type: "tweet",
                original: tweet as any,
            };
        }
    }
    if (youtubeRegex.test(url)) {
        const match = url.match(youtubeRegex);
        const id = match?.groups?.id;
        if (id) {
            const url = `https://www.youtube.com/watch?v=${id}`;
            const u = new URL(`https://youtube.googleapis.com/youtube/v3/videos`)
            u.searchParams.set("part", "snippet,contentDetails,player");
            u.searchParams.set("id", id);
            u.searchParams.set("key", YOUTUBE_KEY)
            const res = await fetch(u.toString());
            const data = await res.json() as VideoListResponse;
            console.dir({ data }, { depth: null });
            const item = data.items?.[0];
            // const res = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
            // const data = await res.json() as YoutubeJson;
            return {
                title: item?.snippet?.title || "",
                author: item?.snippet?.channelTitle || "",
                // author: data.author_name,
                image: item?.snippet?.thumbnails?.high?.url || "",
                type: "video",
                html: item?.player?.embedHtml || "",
                // or summary? text is the one that gets searched, right? do we need to repliace it? hm.
                text: item?.snippet?.description || "",
                summary: item?.snippet?.description?.slice(0, 192) || "",
                uri: url,
                youtubeId: id,
                published: item?.snippet?.publishedAt || "",
                duration: item?.contentDetails?.duration ? dayjs.duration(item?.contentDetails?.duration).asSeconds() : undefined,
                // extended: {
                //    authorUrl: data.author_url,
                // }
            }
            // return {
            //     title: data.title,
            // }
        }
    }
    // check if spotify
    if (spotifyRegex.test(url)) {
        const split = url.split("/");
        const id = split.at(-1);
        const type = split.at(-2) || "";
        if (/(track)/.test(type) && id) {
            const res = await spotify.getTrack(id);
            console.log(`spotify`, { res });
            if (res.body) {
                return {
                    title: res.body.name,
                    type: "audio",
                    author: res.body.artists.map((a) => a.name).join(", "),
                    summary: res.body.album.name,
                    image: res.body.album.images[0]?.url,
                    original: res.body as any,
                    uri: res.body.uri,
                    duration: res.body.duration_ms,
                    published: res.body.album.release_date,
                };
            }
        }
    }
    if (!htmlToParse) {
        console.log({ url });
        const response = await fetch(url);
        console.log({ response });
        if (response.headers.get("content-type")?.includes("text/html")) {
            htmlToParse = await response.text();
        } else if (response.headers.get("content-type")?.includes("application/pdf")) {
            // download pdf
            const pdfArrayBuffer = await response.arrayBuffer();
            // convert to uint8array
            const pdfUint8Array = new Uint8Array(pdfArrayBuffer);
            const title = url;
            const content = "";
            const author = "";
            const image = "";
            const date = "";
            const wordCount = 0;
            const pdf = true;
            // pdfJsLib
            // 	.getDocument(url)
            // 	.promise.then((pdf) => {
            // 		pdf.getMetadata().then((data) => {
            // 			console.log(JSON.stringify(data.info, null, 2));
            // 			console.log(JSON.stringify(data.metadata?.getAll(), null, 2));
            // 			title = data.metadata.get('title');
            // 		});
            // 	})
            // 	.catch((e) => console.log(e));
            return {
                title,
                summary: "",
                author,
                image,
                wordCount,
                // pdf,
                text: "",
            };
            // const blob = await response.blob();
            // const file = new File([blob], 'file.pdf');
        } else if (response.headers.get("content-type")?.includes("image")) {
            // upload to our s3 bucket
            console.log(`image`);
            try {
                const type = response.headers.get("content-type")?.split("/").at(-1);
                // Get File name

                const blob = await response.arrayBuffer()


                // get file name from original file
                const fileName = url.split("/").at(-1);

                // const file = new File([blob], `file.${type}`);
                // don't have access to File constructor, so make buffer
                // const file = await blob.arrayBuffer();
                const Key = `images/${url.replace(/[^a-zA-Z0-9]/g, "_")}.${type}`
                // const Key = `images/${fileName}`
                const data = await uploadFile({
                    Key,
                    Body: blob,
                })
                console.log({ Key, data })
                // const image = URL.createObjectURL(file);
                return {
                    title: fileName,
                    summary: "",
                    image: Key,
                    type: "image"
                }
            } catch (e) {
                console.error(e)
                return {}
            }
        }
    }
    if (htmlToParse) {
        // const parsed = await parseHtml(htmlToParse as string, url);
        // console.log({ parsed });


        const parser = new Parser(url, htmlToParse);
        const isArticle = parser.isReaderable();
        // const doc = parseHTML(htmlToParse as string);
        // const isArticle = isProbablyReaderable(doc.window.document)
        console.log({ isArticle });
        const generateScreenshot = true;
        if (!isArticle) {
            // then it's a bookmark... right?
            const { url: goodbye, ...p } = await parser.parse();
            // get screenshot and upload to s3
            // can we get access to svelte fetch here?
            // maybe do that when we're saving it instead?
            // or only if there's no bookmark?
            // see: /screenshot/:url
            // const res = await fetch()
            // generate screenshot'
            // const title = doc.window.document.title;
            return { url, ...p, type: "bookmark" };
        } else {
            console.log({ isArticle });
            const p = await new Parser(url, htmlToParse).parse();
            if (!p) {
                throw new Error("Could not parse article");
            }
            // const { url: goodbye, ...p } = await parser.parse();
            // console.log({ type: p.type });
            // TODO: store as markdown? (that could be... useful)
            // console.log('parser', { content });
            // or bookmark?
            return {
                ...p
            };
        }
    } else {
        return {
            // title: "",
            // // description: "",
            // text: "",
            // author: "",
            // image: "",
            // date: "",
            // wordCount: 0,
            // textContent: "",
        };
    }
}
