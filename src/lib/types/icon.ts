import { icons } from "$lib/icons";
import { z } from "zod";

const icon_keys = Object.keys(icons) as Array<keyof typeof icons>;
type Icon = Array<keyof typeof icons>[number];
const ICONS: [Icon, ...Icon[]] = [icon_keys[0], ...icon_keys.slice(1)];
const Icon = z.enum(ICONS);
const hexRegex = /#([a-f0-9]{3}){1,2}\b/i;
const emojiRegex = /^\p{Extended_Pictographic}{1}$/u;
export const chosenIcon = z.union([
	z.object({
		name: Icon, // icons
		type: z.literal("icon").default("icon"),
		color: z.string().regex(hexRegex),
	}),
	z.object({
		emoji: z.string(),
		hexcode: z.string(),
		label: z.string(),
		type: z.literal("emoji"),
	}),
	z.object({
		type: z.literal("image"),
		image: z.string().url(),
	}),
]);
export type ChosenIcon = z.infer<typeof chosenIcon>;
