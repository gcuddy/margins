import type { PageLoad } from "./$types";
import { allEpisodesQuery } from "./queries";

export const load = (async (evt) => {
	const { queryClient } = await evt.parent();
	const initialData = await queryClient.ensureQueryData(allEpisodesQuery(evt));
	return {
		initialData,
	};
}) satisfies PageLoad;
