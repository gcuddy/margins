const accentColors = ['orange', 'gray'] as const;

export type AccentColor = (typeof accentColors)[number];
