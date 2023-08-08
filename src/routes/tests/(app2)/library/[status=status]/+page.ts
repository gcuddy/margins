// TODO
// get_library createquery call
// fetch via an API route for the sake of infinite scroll/pagination
// const response = await fetch(
//     `/api/entries/library/${status.toLowerCase()}.json?after_sort=${url.searchParams.get('after_sort') ?? ''}&after_updated=${url.searchParams.get('after_updated') ?? ''}&search=${url.searchParams.get('search') ?? ''}&type=${type ?? ''}`,
// )
// if (!response.ok) {
//     console.error(response)
//     if (response.status === 401) {
//         throw redirect(302, handleLoginRedirect(event));
//     } else {
//         throw error(response.status, await response.text());
//     }
// }
// const { entries, next } = await response.json() as LibraryResponse;
// console.log({ entries, next })

import { queryFactory } from '$lib/queries/querykeys';
import { libraryQuery } from './queries';

export async function load(evt) {
	const { parent } = evt;

	const { queryClient } = await parent();

	await queryClient.prefetchInfiniteQuery(
		queryFactory.entries.list({
			status: evt.data.Status,
			type: evt.data.type,
			search: evt.url.searchParams.get('search') ?? undefined })
	);
	return evt.data;
}
