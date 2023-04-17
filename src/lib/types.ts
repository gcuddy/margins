export const types = [
    // "entry",
    "movie",
    "book",
    "article",
    "podcast",
    "tv"
] as const;

export type Message = { status: 'error' | 'success'; text: string };
