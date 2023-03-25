import { type Actions, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { auth } from '$lib/server/lucia';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(4)
})

import type { PageServerLoad } from './$types';
import { LuciaError } from 'lucia-auth';

export const actions = {
    default: async (event) => {
        const { locals } = event;
        const form = await superValidate(event, schema);
        console.log("login POST", form)
        // Convenient validation check:
        if (!form.valid) {
            // Again, always return { form } and things will just work.
            return fail(400, { form });
        }
        const { email, password } = form.data;
        try {
            const key = await auth.useKey('email', email, password);
            const session = await auth.createSession(key.userId);
            console.log({ session })
            locals.setSession(session);
            return {
                form
            }
        } catch (e) {
            console.error(e);
            if (e instanceof LuciaError) {
                const message = e.message;
                form.message = "Error authenticating";
                return fail(400, { form });
            }
            return fail(400, { form });
            // return fail(400, { message: 'Incorrect email or password' });
        }
    },
} satisfies Actions;

export const load: PageServerLoad = async (event) => {
    const { locals } = event;
    const session = await locals.validate();
    if (session) throw redirect(302, '/');
    const form = await superValidate(event, schema);
    return { form }
};
