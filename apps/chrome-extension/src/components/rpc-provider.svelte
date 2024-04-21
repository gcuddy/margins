<script lang="ts" context="module">
	import type {
		Queries,
		ServerMutations,
	} from '@margins/features/replicache/server';
	import { getContext, setContext } from 'svelte';

	type RPC = {
		mutate: <TMutation extends keyof ServerMutations>(
			mutation: TMutation,
			args: ServerMutations[TMutation]['input'],
		) => Promise<ServerMutations[TMutation]['output']>;
		query: <TQuery extends keyof Queries>(
			query: TQuery,
			args: Queries[TQuery]['input'],
		) => Promise<Queries[TQuery]['output']>;
	};

	export function getRPC() {
		return getContext<RPC>('rpc');
	}
</script>

<script lang="ts">
	export let userID: string;
	export let sessionID: string;
	export let useBackground = false;

	const API_URL = `http://127.0.0.1:1999/parties/main/${userID}`;

	async function _fetch(url: string, options: RequestInit) {
		if (useBackground) {
			return new Promise((resolve, reject) => {
				chrome.runtime.sendMessage(
					{
						action: 'fetchData',
						payload: {
							options,
							url,
						},
					},
					(response) => {
						console.log({ response });
						if (response.error) {
							reject(response);
						} else {
							resolve(response);
						}
					},
				);
			});
		} else {
			return fetch(url, options).then((res) => res.json());
		}
	}

	async function query<TQuery extends keyof Queries>(
		query: TQuery,
		args: Queries[TQuery]['input'],
	) {
		const searchParams = new URLSearchParams(args).toString();
		const json = await _fetch(`${API_URL}/${query}?${searchParams}`, {
			headers: {
				Authorization: 'Bearer ' + sessionID,
				'Content-Type': 'application/json',
			},
		});
		console.log('[rpc-provider.svelte] query', { args, json, query });
		return json as Queries[TQuery]['output'];
	}

	async function mutate<TMutation extends keyof ServerMutations>(
		mutation: TMutation,
		args: ServerMutations[TMutation]['input'],
	) {
		const json = await _fetch(`${API_URL}/${mutation}`, {
			body: JSON.stringify(args),
			headers: {
				Authorization: 'Bearer ' + sessionID,
				'Content-Type': 'application/json',
			},
			method: 'POST',
		});
		console.log('[rpc-provider.svelte] mutate', { args, json, mutation });
		return json as ServerMutations[TMutation]['output'];
	}
	const rpc: RPC = {
		mutate,
		query,
	};

	setContext('rpc', rpc);
</script>

<slot />
