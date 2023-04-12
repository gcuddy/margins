// import { query } from "$lib/utils/client"
// import type { fetchRss } from "./fetch.server"

// export const load = ({ fetch, data }) => {

//     return {
//         // feeds: fetchMore({
//         //     take: 25,
//         // }, fetch),
//         feeds: query<typeof fetchRss>("/tests/rss", {
//             take: 25,
//         }, {
//             fetcher: fetch,
//             userId: data.userId,
//         }),
//         ...data
//     }
//     // feeds: fetchRss({ take: 25, userId: session.userId }),
// }