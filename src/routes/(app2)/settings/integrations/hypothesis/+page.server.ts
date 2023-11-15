import { loginRedirect } from '$lib/utils/redirects';
import { message, superValidate } from 'sveltekit-superforms/server';
import {
	HypothesisSettings,
	hypothesisSchema,
	hypothesisSettingsSchema,
} from './schema';
import { fail } from '@sveltejs/kit';
import { db, json } from '$lib/db';
import { HypothesisApi, SERVICE_NAME } from '$lib/api/hypothesis';
import { createMessage } from '$lib/types/forms';

const TITLE = 'Hypothes.is';

export async function load(event) {
	const session = await event.locals.auth.validate();

	if (!session) throw loginRedirect(event);

	let h: HypothesisApi | null = null;

	const integration = await db
		.selectFrom('Integration')
		.where('userId', '=', session.user.userId)
		.where('serviceName', '=', SERVICE_NAME)
		.select(['accessToken', 'settings'])
		.$narrowType<{
			settings: HypothesisSettings | null;
		}>()
		.executeTakeFirst();

	if (integration?.accessToken) {
		h = new HypothesisApi(integration.accessToken);
		const profile = await h.getProfile();
		const settings = integration.settings ?? {
			groups: profile.groups.map((g) => g.id),
		};
		const annotations = await h.getAnnotations();
		return {
			annotations,
			integration,
			form: superValidate(
				{ apiKey: integration.accessToken },
				hypothesisSchema,
				{ errors: false },
			),
			settingsForm: superValidate(settings, hypothesisSettingsSchema, {
				errors: false,
			}),
			title: TITLE,
			profile,
		};
	}

	return {
		form: superValidate(hypothesisSchema),
		settingsForm: superValidate(hypothesisSettingsSchema),
		title: TITLE,
	};
}

export const actions = {
	apiKey: async (event) => {
		const session = await event.locals.auth.validate();
		const form = await superValidate(event, hypothesisSchema);
		if (!session) return fail(400, { form });

		const { apiKey } = form.data;

		await db
			.insertInto('Integration')
			.values({
				serviceName: SERVICE_NAME,
				updatedAt: new Date(),
				userId: session.user.userId,
				accessToken: apiKey,
			})
			.onDuplicateKeyUpdate({
				updatedAt: new Date(),
				accessToken: apiKey,
			})
			.execute();
	},
	settings: async (event) => {
		const session = await event.locals.auth.validate();
		const form = await superValidate(event, hypothesisSettingsSchema);
		if (!session) return fail(400, { form });

		await db
			.updateTable('Integration')
			.set({ settings: json(form.data) })
			.where('userId', '=', session.user.userId)
			.where('serviceName', '=', SERVICE_NAME)
			.execute();

		return message(
			form,
			createMessage({
				status: 'success',
				text: 'Settings saved',
			}),
		);
	},
};
