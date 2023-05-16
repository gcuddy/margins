export const types = [
    // "entry",
    "movie",
    "book",
    "article",
    "podcast",
    "tv",
    "tweet",
    "video",
    "album",
    "pdf"
] as const;

export type Type = typeof types[number];

export type Message = { status: 'error' | 'success'; text: string };

export const status = [
    "Now",
    "Backlog",
    "Archive"
] as const;

export const number_operands = [">", "<", "=", "<=", ">="] as const;

export const number_operand_lookup = {
    ">": "greater than",
    "<": "less than",
    "=": "equal to",
    "<=": "less than or equal to",
    ">=": "greater than or equal to"
} as const;

export const statusLookup = {
    backlog: "Backlog",
    now: "Now",
    archive: "Archive"
} as const;


