import { error } from '@sveltejs/kit';
import { db } from '$lib/db';
import { z } from 'zod';

const interactionSchema = z.object({
    progress: z.number().min(0).max(1),
    currentPage: z.number().int().positive()
})

export async function POST({ locals, request, params }) {

    const session = await locals.auth.validate();
    if (!session) throw error(401);

    const raw = await request.json();

    const parsed = interactionSchema.safeParse(raw)

    if (!parsed.success) {
        throw error(400, JSON.stringify(parsed.error));
    }

    const { data } = parsed;

    await db.insertInto("EntryInteraction")
        .values({
            userId: session.user.userId,
            updatedAt: new Date(),
            entryId: Number(params.id),
            ...data
        })
        .onDuplicateKeyUpdate(data)
        .execute();

    return new Response(null, { status: 204 })

}
