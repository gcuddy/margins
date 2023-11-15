import { dev } from '$app/environment';
import { CRON_SECRET } from '$env/static/private';
import { importHypothesisAnnotations } from '$lib/jobs/integrations/hypothesis';
import { error, json } from '@sveltejs/kit';

// This cleans up orphaned userentries

export async function GET({ request }) {
	if (!dev) {
		// then validate the request
		const authHeader = request.headers.get('authorization');

		if (authHeader !== `Bearer ${CRON_SECRET}`) {
			throw error(401, 'Unauthorized');
		}
	}

	await importHypothesisAnnotations();

	return json({
		success: true,
	});
}
