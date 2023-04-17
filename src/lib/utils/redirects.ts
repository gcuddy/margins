import type { RequestEvent } from "@sveltejs/kit"

export function handleLoginRedirect(
    event: Pick<RequestEvent, "url">,
    message: string = "You must be logged in to access this page"
) {
    const redirectTo = event.url.pathname + event.url.search
    return `/login?redirectTo=${redirectTo}&message=${message}`
}