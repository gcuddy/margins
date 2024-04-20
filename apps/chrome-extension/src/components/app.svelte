<script lang="ts">
	export let sessionID: string;
	export let userID: string;
	import { Button } from '@margins/ui';
	import type { Document } from '@margins/parser';
	import { parseArticle } from '@margins/parser/client';
	import Spinner from 'lucide-svelte/icons/loader';
	import type { ServerMutations } from '@margins/features/replicache/server';
	import { getCurrentMetadata } from '../utils';
	import RssButton from './rss-button.svelte';

	const API_URL = `http://127.0.0.1:1999/parties/main/${userID}`;

	let saving = false;

	const callApi = async <TMutation extends keyof ServerMutations>(
		mutation: TMutation,
		args: ServerMutations[TMutation]['input'],
	) => {
		const response = await fetch(`${API_URL}/${mutation}`, {
			body: JSON.stringify(args),
			headers: {
				Authorization: 'Bearer ' + sessionID,
				'Content-Type': 'application/json',
			},
			method: 'POST',
		});
		console.log({ response });
	};

	const parser = new DOMParser();
	const parse = (html: string) => {
		const parse = parser.parseFromString(html, 'text/html');

		const querySelectorAll = (selector: string) => {
			return Array.from(parse.querySelectorAll(selector));
		};

		const querySelector = (selector: string) => {
			return parse.querySelector(selector);
		};

		return {
			querySelector,
			querySelectorAll,
		} as Document;
	};

	async function save() {
		await getCurrentMetadata(async (response) => {
			const html = response.html;
			const url = response.url;
			const { url: _, ...article } = await parseArticle(
				{ parse },
				{
					html,
					url: url ?? '',
				},
			);
			await callApi('bookmark_create', {
				entry: article,
				status: 'Backlog',
				uri: url,
			});
		});
		const screenshot = await chrome.tabs.captureVisibleTab();
		console.log({ save });
	}
	async function sendToApi() {
		// const response = await fetch('https://margins.gg/api/annotate', {
		//     method: 'POST',
		//     headers: {
		//         'Content-Type': 'application/json',
		//     },
		//     body: JSON.stringify({ sessionID }),
		// });
		// console.log({ response });
	}
</script>

<Button
	on:click={async () => {
		saving = true;
		await save();
		await sendToApi();
		saving = false;
	}}
	>Save
	{#if saving}
		<Spinner size="24" />
	{/if}
</Button>

<Button>Annotate</Button>

<RssButton parser={{ parse }} />
