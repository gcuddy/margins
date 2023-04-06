import type { fetchRss } from "./fetch.server";
import { stringify } from 'devalue';

export function fetchMore(input: Omit<Parameters<typeof fetchRss>[0], "userId">) {
    // convert to query params, but first have to convert values to string and remoeve undefined
    const data = stringify(input);
    console.log({ data })
    return fetch(`/tests/rss?input=${data}`).then((res) => res.json()) as ReturnType<typeof fetchRss>;
}