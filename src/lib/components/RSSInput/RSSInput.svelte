<script lang="ts">
	import { enhance } from '$lib/actions/form';
	import { notifications } from '$lib/stores/notifications';
	import type Parser from 'rss-parser';
	import Button from '../Button.svelte';
	import Form from '../Form.svelte';
	let showFeedSelect = false;
	let waiting = false;
	export let feeds: Parser.Item[] = [];
	$: if (feeds.length) {
		showFeedSelect = true;
	}
</script>

<!-- use:enhance={{
			pending: () => (waiting = true),
			error: () => (waiting = false),
			result: async ({ form, response }) => {
				waiting = false;
				console.log({ response });
				if (response.ok) {
					const res = await response.json();
					// const feeds = JSON.parse(res)
					form.reset();
					// probably not best practice but whatever
					feeds = JSON.parse(res.feeds);
					console.log(feeds);
					if (Array.isArray(feeds)) {
						// then show feeds
						showFeedSelect = true;
					} else {
						// just subscribe
						console.log;
					}
				} else {
					response.statusText;
					notifications.notify({
						type: 'error',
						message: 'Error adding RSS Feed'
					});
				}
			}
		}} -->
<!-- {#if waiting}
            <div class="spinner">
                <svg
                    class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </div>
        {/if} -->

{#if !showFeedSelect}
	<Form action="/rss/select" method="post">
		<input type="text" placeholder="RSS Feed" name="url" class="text-black" />
		<Button type="submit" disabled={waiting}>Add</Button>
	</Form>
{:else if showFeedSelect}
	Select Feeds
	<!-- <FeedSelect {feeds} /> -->
{/if}
