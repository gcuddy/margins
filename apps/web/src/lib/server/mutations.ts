import { db } from '$lib/db'
import { RelationType } from '$lib/prisma/kysely/enums';
import { z } from 'zod';

export const relationSchema = z.object({
    id: z.string(),
    type: z.nativeEnum(RelationType)
})


export const update_relation = async ({ id, type }: z.infer<typeof relationSchema>) => {
    await db.updateTable("Relation")
        .set({
            type
        })
        .where("id", "=", id)
        .execute();
}
