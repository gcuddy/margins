import {
	BoxSelectIcon,
	Maximize2Icon,
	RectangleVerticalIcon,
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import { z } from 'zod';

export const collectionItemSchema = z.object({
	collectionId: z.number().int(),
	id: z.string().optional(),
});

export const collectionItemWidths = ['default', 'wide', 'poster'] as const;

export const collectionItemWidthIcons: Record<
	CollectionItemWidth,
	ComponentType
> = {
	default: BoxSelectIcon,
	wide: Maximize2Icon,
	poster: RectangleVerticalIcon,
};

export type CollectionItemWidth = (typeof collectionItemWidths)[number];

export const collectionItemWidthSchema = z.enum(collectionItemWidths);

export const collectionItemInput = z.object({
	position: z.number().int().optional(),
	width: collectionItemWidthSchema.optional(),
});

export const collectionItemUpdateInputSchema = z.object({
	data: collectionItemInput,
	id: z.string(),
});
