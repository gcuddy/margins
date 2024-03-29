import { db } from '$lib/db';
import { withEntry } from '$lib/db/selects';
import { loginRedirect } from '$lib/utils/redirects';

/**
 * In practice, when creating a review queue, we usually want to show not only tasks which are due now, but also those which will become due before the user's next likely practice. That is, if a task is going to become due later today, and I'm reviewing now, we should just review it now. This function returns a "fuzzy" due timestamp threshold to use when fetching tasks for the review queue.
 */
// TODO: move this to srs module
function getReviewQueueFuzzyDueTimestampThreshold(
	nowMillis: number = Date.now(),
): number {
	return nowMillis + 1000 * 60 * 60 * 16; // 16 hour lookahead
}

export async function load(event) {
	const session = await event.locals.auth.validate();
	if (!session) throw loginRedirect(event);

	const notes_to_review = await db
		.selectFrom('Annotation as a')
		.selectAll()
		.select((eb) => withEntry(eb))
		.where('srs', '=', 1)
		.where('deleted', 'is', null)
		.where((eb) =>
			eb.or([
				eb(
					'due_timestamp',
					'<',
					new Date(getReviewQueueFuzzyDueTimestampThreshold()),
				),
				eb('due_timestamp', 'is', null),
			]),
		)
		.where('userId', '=', session.user.userId)
		.orderBy('due_timestamp', 'asc')
		.limit(50)
		.execute();

	event.depends('review');
	return {
		notes_to_review,
	};
}
