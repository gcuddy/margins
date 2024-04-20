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
	const API_URL = `http://127.0.0.1:1999/parties/main/${userID}`;
	async function query<TQuery extends keyof Queries>(
		query: TQuery,
		args: Queries[TQuery]['input'],
	) {
		console.log({ API_URL, args, query });
		console.log({ fetch });
		const searchParams = new URLSearchParams(args).toString();
		const response = await fetch(`${API_URL}/${query}?${searchParams}`, {
			headers: {
				Authorization: 'Bearer ' + sessionID,
				'Content-Type': 'application/json',
			},
		});
		console.log({ response });
		const json = (await response.json()) as Queries[TQuery]['output'];
		return json;
	}

	async function mutate<TMutation extends keyof ServerMutations>(
		mutation: TMutation,
		args: ServerMutations[TMutation]['input'],
	) {
		const response = await fetch(`${API_URL}/${mutation}`, {
			body: JSON.stringify(args),
			headers: {
				Authorization: 'Bearer ' + sessionID,
				'Content-Type': 'application/json',
			},
			method: 'POST',
		});
		console.log({ response });
		try {
			const json = await response.json();
			return json as ServerMutations[TMutation]['output'];
		} catch {
			// silent
		}
	}
	const rpc: RPC = {
		mutate,
		query,
	};

	setContext('rpc', rpc);
</script>

<slot />
