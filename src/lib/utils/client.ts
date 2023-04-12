import { stringify } from "devalue";

export function query<T extends (...args: any) => any>(
    endpoint: string,
    input: Omit<Parameters<T>[0], "userId">,
    opts?: Partial<{
        fetcher: typeof fetch;
        userId: string | null;
    }>
): Promise<T> {
    const { fetcher = fetch, userId = null } = opts || {};
    const data = stringify(input);
    console.log({ data });
    let url = `${endpoint}?input=${data}`;
    if (userId) {
        url += `&userId=${userId}`;
    }
    return fetcher(url).then((res) => res.json()) as Promise<T>;
}