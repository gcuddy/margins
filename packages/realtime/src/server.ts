import { createAuth } from '@margins/auth';
import { createDb, type DB } from '@margins/db';
import type { Config as PlanetScaleConfig } from '@planetscale/database';
import type { Lucia } from 'lucia';
import type * as Party from 'partykit/server';

export default class Server implements Party.Server {
	db: DB;
	auth: Lucia;

	constructor(readonly room: Party.Room) {
		// TODO: config
		const config: PlanetScaleConfig = {
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
		const url = new URL(req.url);

		const authorizationHeader = req.headers.get('Authorization');
		const sessionId = this.auth.readBearerToken(authorizationHeader ?? '');

		if (!sessionId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const { user } = await this.auth.validateSession(sessionId);

		if (!user) {
			return new Response('Unauthorized', { status: 401 });
		}

		console.log({ user });

		return new Response('OK');
	}
}

Server satisfies Party.Worker;
