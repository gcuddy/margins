<script lang="ts" context="module">
	export function useCurrentPodcast() {
		const currentPodcast = getContext("currentPodcast");
		if (!currentPodcast) {
			throw new Error("No current podcast context found");
		}
		return currentPodcast as Writable<{
			podcast?: string;
			episode?: string;
		}>;
	}
</script>

<script lang="ts">
	import Icon from "$lib/components/helpers/Icon.svelte";

	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import { getContext, setContext } from "svelte";
	import { Writable, writable } from "svelte/store";

	const currentPodcast = writable<{
		podcast?: string;
		episode?: string;
	}>({});
	setContext("currentPodcast", currentPodcast);
	$: console.log({ $currentPodcast });
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			<div class="flex items-center text-sm">
				<span class="font-medium">Podcasts</span>
				{#if $currentPodcast?.podcast}
					<Icon name="chevronRightMini" className="h-3 w-4 fill-current" />
					<span>{$currentPodcast?.podcast}</span>
				{/if}
			</div>
		</div>
	</DefaultHeader>
</Header>
<slot />
