const accentColors = ['orange', 'gray'] as const;

type AccentColor = (typeof accentColors)[number];
