export const colors = [
    "Yellow",
    "Blue",
    "Green",
    "Pink",
    "Purple"
] as const;

export type Color = typeof colors[number];
