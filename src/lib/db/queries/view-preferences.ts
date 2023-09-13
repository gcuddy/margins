import { type ViewPreferences, ViewType } from '@prisma/client';
import { z } from 'zod';

import {
	defaultViewPreferences,
	ViewPreferencesSchema,
} from '$components/view-preferences/view-preferences.schema';
import { db, json } from '$lib/db';
import { nanoid } from '$lib/nanoid';

import type { GetCtx } from '../types';

export const ViewPreferences_Schema = z.object({
	collectionId: z.number().int().nullable(),
	createdAt: z.date(),
	customViewId: z.number().int().nullable(),
	id: z.string(),
	preferences: ViewPreferencesSchema.nullable(),
	updatedAt: z.date(),
	userId: z.string(),
	viewType: z.nativeEnum(ViewType),
}) satisfies z.ZodType<ViewPreferences>;

export const viewPreferencesCreateInput = ViewPreferences_Schema.partial()
	.omit({
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		id: z.string().default(nanoid),
		preferences: ViewPreferencesSchema.default(defaultViewPreferences),
	})
	.required({
		viewType: true,
	});

export const viewPreferencesUpdateInput = z.object({
	id: z.string(),
	input: z.object({
		preferences: ViewPreferencesSchema,
	}),
});

export async function viewPreferencesCreate({
	ctx,
	input,
}: GetCtx<typeof viewPreferencesCreateInput>) {
	const { userId } = ctx;
	const { id, preferences, ...rest } = input;
	await db
		.insertInto('ViewPreferences')
		.values({
			id,
			preferences: json(preferences),
			userId,
			...rest,
		})
		.ignore()
		.execute();
	return {
		id,
		preferences,
	};
}

export async function viewPreferencesUpdate({
	ctx,
	input,
}: GetCtx<typeof viewPreferencesUpdateInput>) {
	const { userId } = ctx;
	const {
		id,
		input: { preferences },
	} = input;
	await db
		.updateTable('ViewPreferences')
		.where('id', '=', id)
		.where('userId', '=', userId)
		.set({
			preferences: json(preferences),
		})
		.execute();
}
