// import { DocumentType, Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { ApiResponse, PIApiPodcast } from "$lib/features/podcasts/podcastdx";
import { z } from "zod";
import { PODCASTINDEX_API_KEY, PODCASTINDEX_API_SECRET } from "$env/static/private";
import dayjs from "$lib/dayjs";
import { protectedProcedure, publicProcedure, router } from "$lib/trpc/t";
// import { FastAverageColor } from "fast-average-color";
// import Color from "color";

const podcastIndexApiUrl = `https://api.podcastindex.org/api/1.0`;

const buildHeaders = async () => {
    const apiHeaderTime = Math.floor(Date.now() / 1000);
    const data4Hash = PODCASTINDEX_API_KEY + PODCASTINDEX_API_SECRET + apiHeaderTime;
    const encoder = new TextEncoder();
    const data = encoder.encode(data4Hash);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash4Header = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const headers = {
        "Content-Type": "application/json",
        "X-Auth-Date": `${apiHeaderTime}`,
        "X-Auth-Key": PODCASTINDEX_API_KEY,
        Authorization: hash4Header,
        "User-Agent": `Margins/0.1`,
    };
    return new Headers(headers);
};

class PodcastClient {
    private key: string;
    private secret: string;
    private base = "https://api.podcastindex.org/api/1.0`"

    constructor({ key, secret }: { key: string; secret: string; }) {
        this.key = key;
        this.secret = secret;
    }

    private async buildHeaders(Key: string) {
        const apiHeaderTime = Math.floor(Date.now() / 1000);
        const data4Hash = this.key + this.secret + apiHeaderTime;
        const encoder = new TextEncoder();
        const data = encoder.encode(data4Hash);
        const hashBuffer = await crypto.subtle.digest("SHA-1", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash4Header = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        const headers = {
            "Content-Type": "application/json",
            "X-Auth-Date": `${apiHeaderTime}`,
            "X-Auth-Key": Key,
            Authorization: hash4Header,
            "User-Agent": `Margins/0.1`,
        };
        return new Headers(headers);
    }

    private async fetch(endpoint: string, params?: Record<string, string | number | boolean>) {
        const url = new URL(this.base, endpoint);
        if (params) {
            for (let key in params) {
                const value = params[key];
                url.searchParams.set(key, value.toString());
            }
        }
        return fetch(url).then(res => res.json()).catch(e => console.error(e));
    }

    async episodeById(id: number, opts?: {
        fulltext?: boolean;
    }) {
        const data = await this.fetch('episodes/byid', {
            id: id.toString(),
            ...opts
        })
        return data as ApiResponse.EpisodeById
    }

    /**
     * This call returns all the episodes we know about for this feed, in reverse chronological order.
     * Note: The id parameter is the internal Podcastindex id for this feed.
     */
    async episodesByFeedId(id: number | number[], opts?: {
        /** You can specify a maximum number of results to return */
        max?: number;
        /** You can specify a hard-coded unix timestamp, or a negative integer that represents a number of seconds prior to right now. Either way you specify, the search will start from that time and only return feeds updated since then. */
        since?: number;
        fulltext?: boolean;
    }) {
        const data = await this.fetch("episodes/byfeedid", {
            id: Array.isArray(id) ? id.join(",") : id.toString(),
            ...opts
        });
        return data as ApiResponse.EpisodesByFeedId
    }

    async podcastById(id: number) {
        const data = await this.fetch("podcasts/byfeedid", {
            id
        });
        return data as ApiResponse.PodcastById;
    }

    async podcastByItunesId(id: number) {
        const data = await this.fetch("podcasts/byitunesid", {
            id
        });
        return data as ApiResponse.Podcast;
    }

    async search(q: string) {
        const data = await this.fetch("search/byterm", {
            q
        });
        return data as ApiResponse.Search;
    }


}

const client = new PodcastClient({
    key: PODCASTINDEX_API_KEY,
    secret: PODCASTINDEX_API_SECRET
})

async function episodeToEntry(episodeId: number) {
    const data = await client.episodeById(episodeId, {
        fulltext: true,
    });
    const { episode } = data
    const val = Prisma.validator<Prisma.EntryCreateInput>();
    return val({
        podcastIndexId: episodeId,
        title: episode.title,
        published: dayjs.unix(episode.datePublished).toDate(),
        enclosureUrl: episode.enclosureUrl,
        enclosureType: episode.enclosureType,
        enclosureLength: episode.enclosureLength,
        summary: episode.description,
        duration: episode.duration,
        uri: episode.enclosureUrl,
        guid: episode.guid,
        original: JSON.stringify(episode),
        image: episode.image || episode.feedImage,
        type: "audio",
        feed: {
            connectOrCreate: {
                where: {
                    podcastIndexId: episode.feedId,
                },
                create: {
                    podcastIndexId: episode.feedId,
                    title: episode.feedTitle,
                    imageUrl: episode.feedImage,
                    // ....todo
                }
            }
        }
    })
}

export async function getEpisodes({ podcastIndexId, feedUrl }: { podcastIndexId: number; feedUrl: string; }, since?: number) {
    const { items: episodes } = await client.episodesByFeedId(podcastIndexId, {
        since,
    });

    return Prisma.validator<Prisma.EntryCreateManyInput[]>()(
        episodes.slice(0, 10).map((episode) => ({
            title: episode.title,
            published: dayjs.unix(episode.datePublished).toDate(),
            enclosureUrl: episode.enclosureUrl,
            enclosureType: episode.enclosureType,
            enclosureLength: episode.enclosureLength,
            summary: episode.description,
            // uri is constructed of feedUrl + guid
            uri: feedUrl ? feedUrl : 'it:' + episode.feedItunesId + "::" + episode.guid,
            // uri: ,
            duration: episode.duration,
            guid: episode.guid,
            // original: JSON.stringify(episode),
            image: episode.image,
            podcastIndexId: episode.id,
            type: "audio"
        }))
    );
    // return await prisma.feed.update({
    // 	where: {
    // 		podcastIndexId,
    // 	},
    // 	data: {
    // 		entries: {
    // 			createMany: {
    // 				data: episodes.map((episode) => ({
    // 					title: episode.title,
    // 					published: dayjs.unix(episode.datePublished).toDate(),
    // 					enclosureUrl: episode.enclosureUrl,
    // 					enclosureType: episode.enclosureType,
    // 					enclosureLength: episode.enclosureLength,
    // 					summary: episode.description,
    // 					duration: episode.duration,
    // 					guid: episode.guid,
    // 					original: JSON.stringify(episode),
    // 					image: episode.image,
    // 				})),
    // 				skipDuplicates: true,
    // 			},
    // 		},
    // 	},
    // });
}

export const podcastsRouter = router({
    list: protectedProcedure.query(async ({ ctx, input }) => {
        const { prisma, userId } = ctx;
        const feeds = await prisma.feed.findMany({
            where: {
                OR: [
                    {
                        podcastIndexId: {
                            not: null,
                        },
                    },
                    {
                        podcast: true,
                    },
                ],
                subscriptions: {
                    some: {
                        userId,
                    },
                },
            },
        });
        return feeds;
    }),
    episodes: protectedProcedure.query(async ({ ctx, input }) => {
        const { prisma, userId } = ctx;
        // get subscriptinos
        // const feeds = await ctx.prisma.feed.findMany({
        // 	where: {
        // 		podcastIndexId: {
        // 			not: null,
        // 		},
        // 		subscriptions: {
        // 			some: {
        // 				userId,
        // 			},
        // 		},
        // 	},
        // 	include: {
        // 		entries: true,
        // 	},
        // });
        // get max 200
        // const ids = feeds.map((f) => f.podcastIndexId as number).slice(0, 200);
        // const episodes = await client.episodesByFeedId(ids);
        // return episodes.items;
        // REVIEW: ideally we do this with entries so we can see a lot better... but oh well.
        // REVIEW: this performance is not great
        const episodes = await prisma.entry.findMany({
            where: {
                // podcastIndexId: {
                // 	not: null,
                // },
                feed: {
                    subscriptions: {
                        some: {
                            userId,
                        },
                    },
                    OR: [
                        {
                            podcast: true,
                        },
                        {
                            podcastIndexId: {
                                not: null,
                            },
                        },
                    ],
                },
            },
            orderBy: {
                published: "desc",
            },
            take: 25,
            include: {
                feed: {
                    select: {
                        title: true,
                        podcastIndexId: true,
                        id: true,
                        imageUrl: true,
                    },
                },
            },
        });
        console.dir({ episodes }, { depth: null });
        return episodes;
    }),
    refresh: protectedProcedure.mutation(async ({ ctx, input }) => {
        const { userId } = ctx;
        const feeds = await ctx.prisma.feed.findMany({
            where: {
                podcastIndexId: {
                    not: null,
                },
                subscriptions: {
                    some: {
                        userId,
                    },
                },
            },
            select: {
                podcastIndexId: true,
                lastParsed: true,
                feedUrl: true,
                // imageUrl: true,
            },
        });

        for (const feed of feeds) {
            if (!feed.podcastIndexId) continue;
            // get
            const since = feed.lastParsed ? dayjs(feed.lastParsed).unix() : undefined;
            const info = await client.episodesByFeedId(feed.podcastIndexId, {
                since,
            });
            // REVIEW: could add another check via datecrawled vs lastparsed?
            console.log({ info });
            if (!info.items.length) continue;

            const data = info.items.map((episode) => ({
                podcastIndexId: episode.id,
                // instead can use guid/feedUrl to look up
                title: episode.title,
                published: dayjs.unix(episode.datePublished).toDate(),
                enclosureUrl: episode.enclosureUrl,
                enclosureType: episode.enclosureType,
                enclosureLength: episode.enclosureLength,
                summary: episode.description,
                duration: episode.duration,
                guid: episode.guid,
                original: JSON.stringify(episode),
                image: episode.image || episode.feedImage,
                type: "audio",
            }));
            await ctx.prisma.feed.update({
                where: {
                    podcastIndexId: feed.podcastIndexId,
                },
                data: {
                    lastParsed: new Date(),
                    entries: {
                        createMany: {
                            data,
                            skipDuplicates: true,
                        },
                    },
                },
            });
        }

        // const promises = episodesToAdd.flatMap((info) => {
        // 	return info.items.map(
        // 		(episode) => console.log(episode)
        // 		// ctx.prisma.entry.create({
        // 		// 	data: {
        // 		// 		podcastIndexId: episode.id,
        // 		// 		title: episode.title,
        // 		// 		published: dayjs.unix(episode.datePublished).toDate(),
        // 		// 		enclosureUrl: episode.enclosureUrl,
        // 		// 		enclosureType: episode.enclosureType,
        // 		// 		enclosureLength: episode.enclosureLength,
        // 		// 		html: episode.description,
        // 		// 		duration: episode.duration,
        // 		// 		guid: episode.guid,
        // 		// 		// original: JSON.stringify(episode),
        // 		// 		feed: {
        // 		// 			connect: {
        // 		// 				podcastIndexId: episode.feedId,
        // 		// 			},
        // 		// 		},
        // 		// 	},
        // 		// 	// update: {
        // 		// 	// 	original: JSON.stringify(episode),
        // 		// 	// },
        // 		// })
        // 	);
        // });
        // // const entries = await ctx.prisma.$transaction(promises);
        // // console.log(`Upserted ${entries.length}`);

        // // const promises = episodesToAdd.flatMap((info) => {
        // // 	// now group by id
        // // 	const grouped = groupBy(info.items, (item) => item.feedId);
        // // 	let id: keyof typeof grouped;
        // // 	let feed_promises = [];
        // // 	for (id in grouped) {
        // // 		feed_promises.push(
        // // 			ctx.prisma.feed.update({
        // // 				where: {
        // // 					podcastIndexId: +id,
        // // 				},
        // // 				data: {
        // // 					entries: {
        // // 						createMany: {
        // // 							data: grouped[id].map((episode) => ({
        // // 								podcastIndexId: episode.id,
        // // 								title: episode.title,
        // // 								published: dayjs(episode.datePublished).toDate(),
        // // 								enclosureUrl: episode.enclosureUrl,
        // // 								enclosureType: episode.enclosureType,
        // // 								enclosureLength: episode.enclosureLength,
        // // 								summary: episode.description,
        // // 								duration: episode.duration,
        // // 								guid: episode.guid,
        // // 								original: JSON.stringify(episode),
        // // 							})),
        // // 							skipDuplicates: true,
        // // 						},
        // // 					},
        // // 				},
        // // 			})
        // // 		);
        // // 	}
        // // 	return feed_promises;
        // // });
        // // const updatedFeeds = await ctx.prisma.$transaction(promises);
        // // const promises = (input as number[]).map((n) => updatePodcastEpisodes(ctx.prisma, n));
        // await ctx.prisma.$transaction(
        // 	input.map((i) => )
        // );
        // return updatedFeeds;
    }),
    subscribe: protectedProcedure
        // expects pidxid
        .input(
            z.object({
                title: z.string(),
                podcastIndexId: z.number(),
                feedUrl: z.string().optional(),
                imageUrl: z.string().optional(),
                unsubscribe: z.boolean().default(false),
                subscriptionId: z.number().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { podcastIndexId, title, feedUrl, imageUrl, unsubscribe, subscriptionId } = input;
            const { prisma, userId } = ctx;
            const { feed: podcast } = await client.podcastById(podcastIndexId);
            if (unsubscribe) {
                return await prisma.subscription.delete({
                    where: {
                        id: subscriptionId,
                    },
                });
            }
            const subscription = await prisma.subscription.create({
                data: {
                    title,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                    feed: {
                        // TODO: connect to feedUrl if it exists, and update it with podcastIndexId
                        connectOrCreate: {
                            where: {
                                podcastIndexId,
                                podcast: true,
                            },
                            create: {
                                title,
                                podcastIndexId,
                                podcast: true,
                                imageUrl: podcast.artwork,
                                lastParsed: dayjs.unix(podcast.lastParseTime).toDate(),
                                link: podcast.link,
                                feedUrl: podcast.url,
                                description: podcast.description,
                                // guid: podcast.podcastGuid,
                                // podcastIndexData: podcast as unknown as Prisma.JsonObject,

                                // entries: {

                                // }
                            },
                        },
                    },
                },
            });
            const data = await getEpisodes({ podcastIndexId, feedUrl: podcast.url }); // update feed with data
            await prisma.feed.update({
                where: {
                    podcastIndexId,
                },
                data: {
                    entries: {
                        createMany: {
                            data,
                            skipDuplicates: true,
                        },
                    },
                },
            });
            return subscription;
        }),
    public: router({
        search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
            // check cache
            console.log("search")
            const cached = await ctx.redis.get(`podcast:search:${input}`);
            if (cached) {
                console.log("cache hit", cached)
                return cached as ApiResponse.Search
            }
            console.log("cache miss")
            const json = await client.search(input);
            await ctx.redis.set(`podcast:search:${input}`, json, {
                // expire after 1 hour
                ex: 60 * 60,
            });
            return json;
        }),
        getPodcastDetailsByPodcastIndexId: publicProcedure.input(z.coerce.number()).query(async ({ input, ctx }) => {
            interface Podcast extends PIApiPodcast {
                color: string;
            }
            const cached = await ctx.redis.get(`podcast:${input}`);
            if (cached) {
                console.log("cache hit", cached)
                return cached as Podcast
            }
            const podcast = await client.podcastById(input);
            // get image color
            // const image = podcast.feed.artwork || podcast.feed.image;
            // const color = await getAverageColor(image);
            // const c = Color(color.rgb);
            // const finalC = c.fade(0.75);
            // const podcastData = {
            //   ...podcast.feed,
            //   color: finalC.rgb().string(),
            // };
            const podcastData = podcast.feed;
            await ctx.redis.set(`podcast:${input}`, podcastData, {
                // expire after 1 day
                ex: 60 * 60 * 24,
            });
            return podcastData
        }),
        getPodcastEpisodesByPodcastIndexId: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
            try {
                const episodes = await client.episodesByFeedId(input, {
                    max: 10,
                });
                const entries = await ctx.prisma.entry.findMany({
                    where: {
                        feed: {
                            podcastIndexId: input,
                        }
                    },
                    include: {
                        interactions: ctx.userId ? {
                            where: {
                                userId: ctx.userId,
                            }
                        } : undefined
                    }
                })
                const finished = entries.filter(e => e.interactions[0]?.finished).map(e => e.podcastIndexId);
                return { episodes, finished, entries };
            } catch (e) {
                console.error(e);
            }
        }),
        episodeById: publicProcedure.input(z.coerce.number()).query(async ({ input, ctx }) => {
            // get entry and fetch
            const [episodeInfo, entry] = await Promise.all([
                client.episodeById(input, {
                    fulltext: true,
                }),
                ctx.prisma.entry.findFirst({
                    where: {
                        podcastIndexId: input,
                    },
                }),
            ]);
            const { episode } = episodeInfo;
            return { episode, entry };
        }),
        itunesSearch: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
            // check cache
            const cached = await ctx.redis.get(`podcast:itunes:search:${input}`);
            if (cached) {
                return cached as {
                    resultCount: number;
                    results: {
                        artistName: string;
                        artworkUrl600: string;
                        feedUrl: string;
                        genres: string[];
                        id: number;
                        name: string;
                        releaseDate: string;
                        url: string;
                    }[]
                }
            }
            const json = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(input)}&entity=podcast&limit=50`).then(r => r.json());
            await ctx.redis.set(`podcast:itunes:search:${input}`, json, {
                // expire after 1 hour
                ex: 60 * 60,
            });
            return json as {
                resultCount: number;
                results: {
                    artistName: string;
                    artworkUrl600: string;
                    feedUrl: string;
                    genres: string[];
                    id: number;
                    name: string;
                    releaseDate: string;
                    url: string;
                }[]
            };
        }),
        byiTunesId: publicProcedure.input(z.coerce.number()).query(async ({ input, ctx }) => {
            // check redis
            const cached = await ctx.redis.get(`podcast:itunes:${input}`);
            if (cached) {
                return cached as ApiResponse.Podcast
            }
            const podcast = await client.podcastByItunesId(input);
            await ctx.redis.set(`podcast:itunes:${input}`, podcast, {
                // expire after 1 day
                ex: 60 * 60 * 24,
            });
            return podcast;
        }),
        byId: publicProcedure.input(z.coerce.number()).query(async ({ input, ctx }) => {
            // check redis
            const cached = await ctx.redis.get(`podcast:${input}`);
            if (cached) {
                return cached as ApiResponse.Podcast
            }
            const podcast = await client.podcastById(input);
            await ctx.redis.set(`podcast:${input}`, podcast, {
                // expire after 1 day
                ex: 60 * 60 * 24,
            });
            return podcast;
        }),
        byPodcastIndexId: publicProcedure.input(z.number()).query(async ({ input }) => {
            // REVIEW: should this return episodes + podcast details, or just episodes? Is it better to do it it on client side and break it up here?
            const headers = await buildHeaders();
            // Can I cache feed Id stuff?  maybe should proxy calls with fetch on another api — can trpc handle server side fetches?
            console.log(`url`, podcastIndexApiUrl + `/episodes/byfeedid?id=${encodeURIComponent(input)}`);
            // Can I get podcast details from search?
            const [details, episodes] = await Promise.all([
                fetch(podcastIndexApiUrl + `/episodes/byfeedid?id=${encodeURIComponent(input)}`, {
                    headers,
                })
                    .then((res) => res.json())
                    .catch(() => {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                        });
                    }),
                fetch(podcastIndexApiUrl + `/episodes/byfeedid?id=${encodeURIComponent(input)}`, {
                    headers,
                })
                    .then((res) => res.json())
                    .catch(() => {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                        });
                    }),
            ]);
            return {
                details: details as ApiResponse.Podcast,
                episodes: episodes as ApiResponse.Episodes,
            };
        }),
    }),
    saveEpisode: protectedProcedure
        .input(
            z.object({
                episodeId: z.number(),
                entryId: z.number().optional(),
                stateId: z.number().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            // get episode details
            const { episodeId, stateId } = input;
            console.log({ episodeId });

            // should cache this somehow?
            const data = await client.episodeById(episodeId, {
                fulltext: true,
            });

            console.log({ data });
            const { episode } = data;
            const bookmark = await ctx.prisma.bookmark.create({
                data: {
                    user: {
                        connect: {
                            id: ctx.userId,
                        },
                    },
                    state: {
                        connect: {
                            id: stateId ? stateId : (ctx.user?.default_state_id as number),
                        },
                    },
                    entry: {
                        connectOrCreate: {
                            where: {
                                podcastIndexId: episodeId,
                            },
                            create: {
                                podcastIndexId: episodeId,
                                title: episode.title,
                                published: dayjs.unix(episode.datePublished).toDate(),
                                enclosureUrl: episode.enclosureUrl,
                                enclosureType: episode.enclosureType,
                                enclosureLength: episode.enclosureLength,
                                summary: episode.description,
                                duration: episode.duration,
                                uri: episode.link || episode.enclosureUrl,
                                guid: episode.guid,
                                original: JSON.stringify(episode),
                                image: episode.image || episode.feedImage,
                                type: "audio",
                            },
                            // e,
                        },
                    },
                },
            });
            console.dir({ bookmark }, { depth: null });
            return bookmark;
        }),
    detail: protectedProcedure
        .input(z.object({
            id: z.number().optional(),
            podcastIndexId: z.number().optional(),
        }))
        .query(async ({ input, ctx }) => {
            const { id, podcastIndexId } = input;
            if (!id && !podcastIndexId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                });
            }
            // const feed = await ctx.prisma.feed.findUnique({
            // 	where: {
            // 		id: id || undefined,
            // 		podcastIndexId: podcastIndexId || undefined,
            // 	},
            // 	include: {
            // 		entries: {
            // 			include: {
            // 				interactions: {
            // 					where: {
            // 						user: {
            // 							id: ctx.userId,
            // 						},
            // 					},
            // 				},
            // 			}
            // 		}
            // 	}
            // })
            const entry = await ctx.prisma.entry.findMany({
                where: {
                    feed: {
                        podcastIndexId
                    }
                },
                // get user interaction
                include: {
                    interactions: {
                        where: {
                            user: {
                                id: ctx.userId,
                            },
                        },
                    },
                }
            });
            if (!entry) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                });
            }
            return entry;
        }
        ),
    updateEpisodeInteraction: protectedProcedure
        .input(z.object({
            podcastIndexId: z.coerce.bigint().optional(),
            entryId: z.coerce.number().optional(),
            enclosureUrl: z.string().optional(),
            finished: z.coerce.boolean().optional(),
            progress: z.coerce.number().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { podcastIndexId, finished, enclosureUrl, progress } = input;
            console.log({ input })
            let entryId = input.entryId;
            if (!entryId && podcastIndexId) {
                const entry = await ctx.prisma.entry.findUnique({
                    where: {
                        podcastIndexId,
                    },
                });
                if (!entry) {
                    // try to create
                    if (podcastIndexId) {
                        const ep = (await episodeToEntry(Number(podcastIndexId)));
                        const e = await ctx.prisma.entry.create({
                            data: ep,
                        });
                        entryId = e.id;
                    }
                    //
                } else {
                    entryId = entry.id;
                    // throw new TRPCError({
                    // 	code: "BAD_REQUEST",
                    // });
                }
            }
            if (!entryId) return;
            return ctx.prisma.interaction.upsert({
                where: {
                    userId_entryId: {
                        userId: ctx.userId,
                        entryId: entryId,
                    }
                },
                update: {
                    finished,
                    progress,
                },
                create: {
                    finished,
                    progress,
                    user: {
                        connect: {
                            id: ctx.userId,
                        },
                    },
                    entry: {
                        connect: {
                            id: entryId,
                        },
                    },
                },
            });
        })
});
