import { handleLoginRedirect } from '$lib/utils/redirects';
import { redirect } from '@sveltejs/kit';
import { fetchList } from '../fetch.server';


const statusLookup = {
    backlog: "Backlog",
    now: "Now",
    archive: "Archive"
} as const;


export const load = (async (event) => {
    const { locals, url } = event;
    const session = await locals.validate();
    if (!session) {
        throw redirect(302, handleLoginRedirect(event));
    }
    const status = statusLookup[event.params.status.toLowerCase() as keyof typeof statusLookup];
    if (!status) {
        // this shouldn't be the case given our param checker, bt just in case
        throw redirect(302, "/library/backlog");
    }
    const userId = session.userId;
    return {
        entries: fetchList({ take: 25, userId, status })
    };
})