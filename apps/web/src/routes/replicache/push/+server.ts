import { db } from '@margins/db';
import { withUser } from '@margins/features/core';
import { server } from '@margins/features/replicache/server';
import type { PushRequestV1 } from 'replicache';

export async function POST({ locals, request }) {
	console.log('push server');

	if (!locals.user) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const user = locals.user;

	const body = (await request.json()) as PushRequestV1;

	const actor = 'user';

	console.log({ user });
	withUser(user, async () => {
		for (const mutation of body.mutations) {
			await db.transaction().execute(async (trx) => {
				const group = (await trx
					.selectFrom('replicache_client_group')
					.select(['id', 'cvrVersion', 'clientVersion', 'updatedAt'])
					.forUpdate()
					.where('replicache_client_group.id', '=', body.clientGroupID)
					.executeTakeFirst()) ?? {
					clientVersion: 0,
					cvrVersion: 0,
					id: body.clientGroupID,
				};

				const client = (await trx
					.selectFrom('replicache_client')
					.select(['id', 'clientGroupId', 'lastMutationId', 'clientVersion'])
					.where('clientGroupId', '=', body.clientGroupID)
					.executeTakeFirst()) ?? {
					clientGroupId: body.clientGroupID,
					clientVersion: 0,
					id: body.clientGroupID,
					lastMutationId: 0,
				};

				const nextClientVersion = group.clientVersion + 1;
				const nextMutationId = client.lastMutationId + 1;

				if (mutation.id < nextMutationId) {
					console.log(
						`Mutation ${mutation.id} has already been processed. Skipping.`,
					);
					return;
				}

				if (mutation.id > nextMutationId) {
					throw new Error(
						`Mutation ${mutation.id} is out of order. Expected ${nextMutationId}.`,
					);
				}

				const { args, name } = mutation;

				console.log(
					`Processing mutation ${mutation.id} ${name} ${JSON.stringify(args)}`,
				);

				try {
					await server.execute(name, args);
					console.log(`Mutation ${mutation.id} processed successfully.`);
				} catch (e) {
					console.error(e);
					console.log(`Mutation ${mutation.id} failed.`);
				}

				await trx
					.insertInto('replicache_client_group')
					.values({
						clientVersion: nextClientVersion,
						cvrVersion: group.cvrVersion,
						id: body.clientGroupID,
						updatedAt: new Date(),
						// actor?
					})
					.onDuplicateKeyUpdate({
						clientVersion: nextClientVersion,
						cvrVersion: group.cvrVersion,
						updatedAt: new Date(),
					})
					.execute();
			});
		}
	});
	// TODO: poke

	return Response.json({ success: true });
}
