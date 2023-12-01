import { HypothesisApi, SERVICE_NAME } from '$lib/api/hypothesis';
import { parse } from '$lib/api/parse';
import { db, json } from '$lib/db';
import { nanoid } from '$lib/nanoid';
import type { Annotation } from '$lib/prisma/kysely/types';
import type { Insertable } from 'kysely';

const cachedEntryMap = new Map<string, number>();

// TODO: add bookmark as well
async function findOrCreateEntry(uri: string) {
	if (cachedEntryMap.has(uri)) {
		return cachedEntryMap.get(uri)!;
	}

	const entry = await db
		.selectFrom('Entry')
		.where('uri', '=', uri)
		.select('id')
		.executeTakeFirst();

	if (entry?.id) {
		cachedEntryMap.set(uri, Number(entry.id));
		return entry.id;
	}

	// parse entry

	const parsed = await parse(uri);

	const newEntry = await db
		.insertInto('Entry')
		.values({
			updatedAt: new Date(),
			...parsed,
			podcastIndexId: parsed.podcastIndexId
				? Number(parsed.podcastIndexId)
				: null,
			uri,
		})
		.executeTakeFirst();

	cachedEntryMap.set(uri, Number(newEntry.insertId));
	return Number(newEntry.insertId);
}
//  get recent annotations
// check if they've been imported, if not, import them
export async function importHypothesisAnnotations() {
	// get users with integration enabled
	// TODO: chunk into 1000s
	const integrations = await db
		.selectFrom('Integration')
		.where('serviceName', '=', SERVICE_NAME)
		.where('serviceName', 'is not', null)
		.where('enabled', '=', 1)
		.selectAll()
		.$narrowType<{ accessToken: string }>()
		.execute();

	const annotationsToAdd = await Promise.all(
		integrations.map(async (integration) => {
			// integration.
			const h = new HypothesisApi(integration.accessToken);
			const annotations = await h.getAnnotations(200);
			// TODO: tags
			// TODO: use uri to find entry. If it exists, add entryId to annotation. If not, parse it.
			return await Promise.all(
				annotations
					.map(async (annotation) => {
						try {
							const entryId = await findOrCreateEntry(annotation.uri);
							return {
								id: nanoid(),
								hypothesis_id: annotation.id,
								body: annotation.text,
								target: annotation.target[0]
									? json(annotation.target[0])
									: null,
								entryId,
								userId: integration.userId,
							} satisfies Insertable<Annotation>;
						} catch (e) {
							return null;
						}
					})
					.filter(Boolean),
			);
		}),
	);

	const flattenedAnnotationsToAdd = annotationsToAdd.flat().filter(Boolean);

	db.insertInto('Annotation')
		.values(flattenedAnnotationsToAdd)
		.ignore()
		.execute();
}
