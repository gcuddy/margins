import { noop } from '$lib/helpers';
import type { PersistedClient, Persister, Promisable } from '@tanstack/query-persist-client-core';

const dbName = 'QUERY_CACHE_PERSIST_DB';
const dbVersion = 1;

const objectStore = 'queryCache';

const openDB = () => {
	return new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(dbName, dbVersion);
		request.onerror = () => {
			reject(request.error);
		};
		request.onsuccess = () => {
			resolve(request.result);
		};
		request.onupgradeneeded = () => {
			const db = request.result;
			db.createObjectStore(objectStore);
		};
	});
};

type OperationFn = (store: IDBObjectStore) => Promise<void>;

class TransactionQueue {
	private queue: Array<OperationFn> = [];
	private isProcessing = false;
	private interval = 60;
	private lastTime = 0;

	constructor() {
		this.queue = [];
		this.isProcessing = false;
	}

	public enqueue(fn: OperationFn) {
		this.queue.push(fn);
		if (!this.isProcessing && !this.tooSoon()) {
			this.processQueue();
		}
	}

	private tooSoon() {
		const tooSoon = Date.now() - this.lastTime < this.interval;
		console.log({ tooSoon });
		return tooSoon;
	}

	private async processQueue() {
		this.isProcessing = true;
		const db = await openDB();
		const transaction = db.transaction(objectStore, 'readwrite');
		const store = transaction.objectStore(objectStore);

		console.log('Processing queue', this.queue.length);
		console.log({ queue: this.queue });

        // (actually, we only need the final item in the queue)
        const fn = this.queue.pop();
        if (fn) {
            await fn(store);
        }
        this.queue = [];

		// while (this.queue.length) {
		// 	const fn = this.queue.shift();
		// 	if (fn) {
		// 		await fn(store);
		// 	}
		// }

		transaction.oncomplete = (e) => {
            console.log('Transaction complete', e);
			db.close();
			this.isProcessing = false;
			if (this.queue.length && !this.tooSoon()) {
				this.processQueue();
			}
			this.lastTime = Date.now();
		};
	}
}

interface PersisterOptions {
	/**
	 * How to serialize the data to storage.
	 * @default `JSON.stringify`
	 */
	serialize?: (client: PersistedClient) => string;
	/**
	 * How to deserialize the data from storage.
	 * @default `JSON.parse`
	 */
	deserialize?: (cachedString: string) => PersistedClient;
}

export class CustomPersister implements Persister {
	private queue: TransactionQueue;
	private serialize: (client: PersistedClient) => string;
	private deserialize: (cachedString: string) => PersistedClient;

	constructor({ serialize = JSON.stringify, deserialize = JSON.parse }: PersisterOptions) {
		this.queue = new TransactionQueue();
		this.serialize = serialize;
		this.deserialize = deserialize;
	}

	async persistClient(persistClient: PersistedClient) {
		console.log({ persistClient });
		// TODO: async throttle?
		this.queue.enqueue(async (store) => {
			const request = store.put(this.serialize(persistClient), 'persistedClient');
			request.onerror = () => {
				console.error('Failed to persist client', request.error);
			};
		});
	}

	async restoreClient() {
		const cacheString = await new Promise<string | undefined>((resolve, reject) => {
			this.queue.enqueue(async (store) => {
				const request = store.get('persistedClient');
				request.onerror = () => {
					reject(request.error);
				};
				request.onsuccess = () => {
					resolve(request.result);
				};
			});
		});
		if (!cacheString) return;
		return this.deserialize(cacheString);
	}

	async removeClient() {
		this.queue.enqueue(async (store) => {
			const request = store.delete('persistedClient');
			request.onerror = () => {
				console.error('Failed to remove persisted client', request.error);
			};
		});
	}
}

interface AsyncThrottleOptions {
	interval?: number;
	onError?: (error: unknown) => void;
}

// via https://github.com/TanStack/query/blob/beta/packages/query-async-storage-persister/src/asyncThrottle.ts
export function asyncThrottle<Args extends ReadonlyArray<unknown>>(
	func: (...args: Args) => Promise<void>,
	{ interval = 1000, onError = noop }: AsyncThrottleOptions = {}
) {
	if (typeof func !== 'function') throw new Error('argument is not function.');

	let running = false;
	let lastTime = 0;
	let timeout: ReturnType<typeof setTimeout>;
	let currentArgs: Args | null = null;

	const execFunc = async () => {
		if (currentArgs) {
			const args = currentArgs;
			currentArgs = null;
			try {
				running = true;
				await func(...args);
			} catch (error) {
				onError(error);
			} finally {
				lastTime = Date.now(); // this line must after 'func' executed to avoid two 'func' running in concurrent.
				running = false;
			}
		}
	};

	const delayFunc = async () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (running) {
				delayFunc(); // Will come here when 'func' execution time is greater than the interval.
			} else {
				execFunc();
			}
		}, interval);
	};

	return (...args: Args) => {
		currentArgs = args;

		const tooSoon = Date.now() - lastTime < interval;
		if (running || tooSoon) {
			delayFunc();
		} else {
			execFunc();
		}
	};
}
