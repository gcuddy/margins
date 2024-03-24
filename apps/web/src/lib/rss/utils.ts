export async function getFeedText(feedUrl: string) {
    const text = await fetch(feedUrl).then((res) => res.text());
    return text;
}
