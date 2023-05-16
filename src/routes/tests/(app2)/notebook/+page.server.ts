import { db } from "$lib/db";
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { annotations as $annotation, withEntry } from "$lib/db/selects";

export const load = (async ({ locals }) => {
    const session = await locals.validate();
    if (!session) throw redirect(303, '/tests/login');
    // console.time("notebook")
    // const annotations = await db.selectFrom("Annotation as a")
    //     .innerJoin("Entry as e", "a.entryId", "e.id")
    //     .select($annotation.select)
    //     .select(withEntry)
    //     .where("userId", "=", session.userId)
    //     .where(({ or, cmpr }) => or([
    //         cmpr("a.type", "=", "annotation"),
    //         cmpr("a.type", "=", "note")
    //     ]))
    //     .where("deleted", "is", null)
    //     .orderBy("a.updatedAt", "desc")
    //     .limit(25)
    //     .execute();

    // console.timeEnd("notebook")
    return {
        // annotations,
        session
    };
}) satisfies PageServerLoad;