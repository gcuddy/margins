import { db } from '$lib/db';
import { withEntry } from '$lib/db/selects';
import { loginRedirect } from '$lib/utils/redirects';
import { fail } from '@sveltejs/kit';

export async function load(event) {
	const { params, locals } = event;
	const session = await locals.auth.validate();
	if (!session) throw loginRedirect(event);
	const { id } = params;
	const note = await db
		.selectFrom('Annotation as a')
		.where('id', '=', id)
		.where('userId', '=', session.user.userId)
		.selectAll()
		.select((eb) => withEntry(eb))
		.executeTakeFirstOrThrow();

	return {
		note,
	};
}

const defaultSpacedRepetitionSchedulerConfiguration = {
	intervalGrowthFactor: 2.3,
	initialReviewInterval: 1000 * 60 * 60 * 24 * 5 // five days
};

export const actions = {
	mark: async ({ request, locals, params }) => {
		// TODO: Mark as Remebbered or Forgotten (and update)

		const data = await request.formData();
		const remembered =
			data.get('remembered') === '1' ? true : data.get('remembered') === '0' ? false : null;
		if (remembered === null) {
			console.log('fail');
			return fail(400);
		}

		console.log({ remembered });
		// get the current stauts
		const { id } = params;
		const note = await db
			.selectFrom('Annotation')
			.where('id', '=', id)
			.selectAll()
			.executeTakeFirstOrThrow();
		console.log({ note });
		const timestamp_ms = new Date().getTime();

		let current_review_interval_ms: number;

		if (note.srs_created_at) {
			current_review_interval_ms = Math.max(
				0,
				timestamp_ms - new Date(note.srs_created_at).getTime()
			);
		} else if (note.createdAt) {
			current_review_interval_ms = Math.max(0, timestamp_ms - new Date(note.createdAt).getTime());
		} else {
			current_review_interval_ms = 0;
		}

		let new_interval_ms: number;

		if (remembered) {
			if (current_review_interval_ms < (note.interval_ms ?? 0)) {
				new_interval_ms = Math.max(
					note.interval_ms ?? 0,
					defaultSpacedRepetitionSchedulerConfiguration.initialReviewInterval,
					Math.floor(
						current_review_interval_ms *
							defaultSpacedRepetitionSchedulerConfiguration.intervalGrowthFactor
					)
				);
			} else {
				new_interval_ms = Math.max(
					defaultSpacedRepetitionSchedulerConfiguration.initialReviewInterval,
					Math.floor(
						current_review_interval_ms *
							defaultSpacedRepetitionSchedulerConfiguration.intervalGrowthFactor
					)
				);
			}
		} else {
			// fail!!!!
			if (
				(note.interval_ms ?? 0) <
				defaultSpacedRepetitionSchedulerConfiguration.initialReviewInterval
			) {
				// They haven't managed to hit the minimum review interval yet, so we stay at the same interval.
				new_interval_ms = note.interval_ms ?? 0;
			} else {
				new_interval_ms = Math.max(
					defaultSpacedRepetitionSchedulerConfiguration.initialReviewInterval,
					Math.floor(
						current_review_interval_ms /
							defaultSpacedRepetitionSchedulerConfiguration.intervalGrowthFactor
					)
				);
			}
		}

		const jitter = (timestamp_ms % 1000) * (60 * 10);

		const new_due_timestamp_ms =
			timestamp_ms +
			jitter +
			(remembered ? new_interval_ms : 1000 * 60 * 10); // about 10 minutes

		console.log({
			new_due_timestamp_ms,
			new_interval_ms
		});

		await db
			.updateTable('Annotation')
			.set({
				last_reviewed_at: new Date(),
				due_timestamp: new Date(new_due_timestamp_ms),
				interval_ms: new_interval_ms
			})
			.where('id', '=', id)
			.execute();

		return {
			sucess: true,
			new_interval_ms,
			new_due_timestamp_ms
		};
	},
	delete: async ({ params }) => {
		const { id } = params;
		await db
			.updateTable('Annotation')
			.where('id', '=', id)
			.set({
				deleted: new Date()
			})
			.execute();
		return {
			sucess: true
		};
	}
};
