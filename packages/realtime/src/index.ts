import { createAuth } from '@margins/auth';
import { createDb, type DB } from '@margins/db';
import {
	handlePull,
	handlePush,
	server,
} from '@margins/features/replicache/server';
import type { Config as PlanetScaleConfig } from '@planetscale/database';
import type { Lucia } from 'lucia';
import type * as Party from 'partykit/server';
import { z } from 'zod';
import type { PushRequestV1 } from 'replicache';
import { withDB, withUser } from '@margins/features/core';

const mutationSchema = z
	.object({
		args: z.any(),
		clientID: z.string(),
		id: z.number(),
		name: z.string(),
		timestamp: z.number(),
	})
	.passthrough();

const pushRequestV0Schema = z.object({
	pushVersion: z.literal(0),
});

const pushRequestV1Schema = z.object({
	clientGroupID: z.string(),
	mutations: z.array(mutationSchema),
	profileID: z.string(),
	pushVersion: z.literal(1),
	schemaVersion: z.string(),
});
const cookieSchema = z.union([
	z.object({
		// partialSync: partialSyncStateSchema,
		order: z.number(),

		version: z.number(),
	}),
	z.number(),
	z.null(),
]);

type Cookie = z.TypeOf<typeof cookieSchema>;
const pullRequestV1 = z.object({
	clientGroupID: z.string(),
	cookie: cookieSchema,
	profileID: z.string(),
	pullVersion: z.literal(1),
	schemaVersion: z.string(),
});

export default class Server implements Party.Server {
	db: DB;
	auth: Lucia;

	constructor(readonly room: Party.Room) {
		const config: PlanetScaleConfig = {
			// Hacky way to get around cloudflare not supporting cache rn,
			// see https://github.com/cloudflare/workerd/issues/698
			fetch: (url, init) => {
				if (init) delete init['cache'];
				return fetch(url, init);
			},
			host: room.env.DATABASE_HOST as string,
			password: room.env.DATABASE_PASSWORD as string,
			username: room.env.DATABASE_USERNAME as string,
		};
		this.db = createDb(config);
		this.auth = createAuth(config);
	}

	onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// A websocket just connected!
		console.log(
			`Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
		);

		// let's send a message to the connection
		conn.send('hello from server');
	}

	onMessage(message: string, sender: Party.Connection) {
		// let's log the message
		console.log(`connection ${sender.id} sent message: ${message}`);
		// as well as broadcast it to all the other connections in the room...
		this.room.broadcast(
			`${sender.id}: ${message}`,
			// ...except for the connection it came from
			[sender.id],
		);
	}

	async onRequest(req: Party.Request): Promise<Response> {
		console.log('got request');
		const url = new URL(req.url);
		console.log('pathname', url.pathname);
		const paths = url.pathname.split('/').filter(Boolean);
		const route = paths.slice(3).join('/');
		console.log({ paths, route, url });

		// TODO: cors handling
		// const origin =

		// TODO: csrf for auth

		const authorizationHeader = req.headers.get('Authorization');
		const sessionId = this.auth.readBearerToken(authorizationHeader ?? '');

		console.log({ authorizationHeader, sessionId });

		if (!sessionId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const { user } = await this.auth.validateSession(sessionId);

		if (!user) {
			return new Response('Unauthorized', { status: 401 });
		}

		console.log({ user });

		if (req.method === 'POST') {
			return await withDB(this.db, async () => {
				if (route === 'push') {
					const body = pushRequestV1Schema.parse(await req.json());
					await handlePush(this.db, user, body as PushRequestV1);
					await this.sendPoke();
					return Response.json({ ok: true });
				} else if (route === 'pull') {
					const body = pullRequestV1.parse(await req.json());
					const pull = await handlePull(this.db, user, body);
					console.log('returning pull', pull);
					return Response.json(pull);
				} else {
					console.log({ route });
					// check if we're doing rpc of server?
					if (server.has(route)) {
						return await withUser(user, async () => {
							console.log('server has route');
							await server.execute(route, await req.json());
							await this.sendPoke();
							return Response.json({ ok: true });
						});
					}
				}
				return new Response('Not found', { status: 404 });
			});
		}

		return new Response('Not found', { status: 404 });
	}

	async sendPoke() {
		const t0 = Date.now();
		this.room.broadcast('poke', []);
		console.log('Sent poke in', Date.now() - t0);
	}
}

Server satisfies Party.Worker;
