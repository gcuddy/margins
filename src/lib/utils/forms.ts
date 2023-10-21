import { applyAction, deserialize } from '$app/forms';
import { fail, type RequestEvent } from '@sveltejs/kit';
import type { Session } from 'lucia';
import type { z } from 'zod';

export const post = async <
	TBody extends Record<string, string | number | boolean>,
>(
	action: string,
	body?: TBody,
) => {
	const data = new FormData();
	Object.entries(body || {}).forEach(([key, value]) => {
		if (key && value) {
			data.append(key, value.toString());
		}
	});
	const actionUrl = new URL(action, location.origin);
	const response = await fetch(action, {
		body: data,
		headers: {
			accept: 'application/json',
			'x-sveltekit-action': 'true',
		},
		cache: 'no-store',
		method: 'POST',
	});
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	const result = deserialize(await response.text());
	if (result.type === 'error') {
		// TODO: do we want to throw here?
		throw new Error(result.error);
	} else {
		// invalidate?
		// this is taken from https://github.com/sveltejs/kit/blob/master/packages/kit/src/runtime/app/forms.js#L206
		if (
			location.origin + location.pathname ===
				actionUrl.pathname + actionUrl.pathname ||
			result.type === 'redirect'
		) {
			applyAction(result);
		}
		return result;
	}
};

export { post as postForm };

export function validate_form<
	TSchema extends z.ZodTypeAny,
	TRequestEvent extends RequestEvent = RequestEvent,
>(
	schema: TSchema,
	handler: (
		data: TRequestEvent & {
			data: z.infer<TSchema>;
			session: Session;
		},
	) => unknown,
): (event: TRequestEvent) => Promise<unknown> {
	//
	return async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const form = await event.request.formData();

		// TODO: this doesn't support scalar string arrays
		const data = Object.fromEntries(form.entries());

		const parsed = schema.safeParse(data);

		if (!parsed.success) {
			return fail(422, {
				data,
				errors: parsed.error.issues,
			});
		}

		return await handler({
			...event,
			data,
			session,
		});
	};
}
