import type { DB, KyselyDB} from '@margins/db';
import { Context } from '@margins/lib/server';
import type { Transaction } from 'kysely';
import { useDB } from './db.js';

type TxOrDb = DB | Transaction<KyselyDB>;

const TransactionContext = Context.create<{
	effects: (() => void | Promise<void>)[];
	tx: TxOrDb;
}>('TransactionContext');

export async function useTransaction<T>(callback: (trx: TxOrDb) => Promise<T>) {
	try {
		const { tx } = TransactionContext.use();
		return callback(tx);
	} catch {
		const db = useDB();
		return callback(db);
	}
}

export async function createTransactionEffect<T>(
	effect: () => void | Promise<void>,
) {
	try {
		const { effects } = TransactionContext.use();
		effects.push(effect);
	} catch {
		await effect();
	}
}

export async function createTransaction<T>(cb: (tx: TxOrDb) => Promise<T>) {
	try {
		const { tx } = TransactionContext.use();
		return cb(tx);
	} catch {
		// const result = await
		const effects: (() => void | Promise<void>)[] = [];

		const db = useDB();

		const result = await db
			.transaction()
			.setIsolationLevel('serializable')
			.execute(async (tx) => {
				const result = await TransactionContext.with(
					{
						effects,
						tx,
					},
					async () => cb(tx),
				);
				return result;
			});

		await Promise.all(effects.map((effect) => effect()));
		return result;
	}
}
