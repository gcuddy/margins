import type { ApiResponse } from "podcastdx-client/dist/src/types";
import { podcastEpisodesQuery, queryKeys } from "$lib/features/podcasts/queries";
import type { PageLoad } from "./$types";

export const load = (async (e) => {
	const episodeId = +e.params.episodeId;
	const { queryClient, id } = await e.parent();
	const placeholderData = queryClient
		.getQueryData<ApiResponse.Episodes>(queryKeys.episodes(id))
		?.items?.find((d) => d.id === episodeId);
	console.log({ placeholderData, episodeId });
	return {
		episodeId,
		placeholderData,
	};
}) satisfies PageLoad;
