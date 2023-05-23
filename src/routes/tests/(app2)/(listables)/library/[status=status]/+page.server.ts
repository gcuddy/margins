import { bulkEntriesSchema, urlSchema } from '$lib/schemas';
import { handleLoginRedirect } from '$lib/utils/redirects';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { fetchList } from '../fetch.server';
import type { PageServerLoad } from './$types';
import { type Type, types, statusLookup } from '$lib/types';
import type { LibraryResponse } from '$lib/server/queries';


export const load = (async (event) => {
    const { locals, url, fetch } = event;
    // const session = await locals.validate();
    // if (!session) {
    //     throw redirect(302, handleLoginRedirect(event));
    // }
    const status = statusLookup[event.params.status.toLowerCase() as keyof typeof statusLookup];
    if (!status) {
        // this shouldn't be the case given our param checker, bt just in case
        throw redirect(302, "/tests/library/now");
    }

    event.depends("entries")
    // const userId = session.userId;

    const type = types.includes(url.searchParams.get("type") ?? '') ? url.searchParams.get("type") as Type : undefined;

    // fetch via an API route for the sake of infinite scroll/pagination
    const response = await fetch(
        `/api/entries/library/${status.toLowerCase()}.json?after_sort=${url.searchParams.get('after_sort') ?? ''}&after_updated=${url.searchParams.get('after_updated') ?? ''}&search=${url.searchParams.get('search') ?? ''}&type=${type ?? ''}`,
    )
    if (!response.ok) {
        console.error(response)
        if (response.status === 401) {
            throw redirect(302, handleLoginRedirect(event));
        } else {
            throw error(response.status, await response.text());
        }
    } 
    const { entries, next } = await response.json() as LibraryResponse;
    console.log({ entries, next })

    return {
        status: status.toLocaleLowerCase() as keyof typeof statusLookup,
        Status: status,
        type,
        urlForm: superValidate(urlSchema),
        bulkForm: superValidate(bulkEntriesSchema),
        // userId: session.userId,
        entries,
        next
    };
}) satisfies PageServerLoad
