 import { get_library } from "$lib/server/queries";
import { Type, statusLookup, types } from "$lib/types";
import { error, json } from "@sveltejs/kit";

function is_type(type: string): type is Type {
    return types.includes(type as Type);
}

export async function GET({ params, locals, url }) {
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, "Unauthorized");
    }

    const userId = session.user.userId;
    const status = statusLookup[params.status as keyof typeof statusLookup] ?? null;
    const after_sort = url.searchParams.get("after_sort");
    const after_updatedAt = url.searchParams.get("after_updated");
    console.log({ after_sort, after_updatedAt })
    const cursor = after_sort && after_updatedAt ? {
        sort_order: Number(after_sort),
        updatedAt: new Date(after_updatedAt)
    } : undefined;

    const search = url.searchParams.get("search") || undefined;
    const type = url.searchParams.get("type") || '';

    console.log({ cursor })
    console.time("fetchList");
    const { entries, next } = await get_library(userId, status, { search, type: is_type(type) ? type : undefined }, cursor)
    console.timeEnd("fetchList");

    return json({ entries, next });
}
