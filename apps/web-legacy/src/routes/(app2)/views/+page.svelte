<script lang="ts">
	import Header from '$components/ui/Header.svelte';
	import { Button } from '$lib/components/ui/button';
	export let data;
	import { Layers, Plus } from 'radix-icons-svelte';
</script>

<Header title="Views">
	<svelte:fragment slot="end">
		<Button size="sm" variant="outline" href="/views/explore/library">
			<Plus class="mr-1" />
			New view</Button
		>
	</svelte:fragment>
</Header>
<!-- <div class="flex items-center justify-between">
	<div>
		<Lead>Views allow you to see stuff you've saved in different ways.</Lead>
	</div>
</div> -->
<div class="flex flex-col">
	{#each data.views as view}
		<a class="block h-16" href="/views/{view.id}">
			<div class="flex h-full items-center gap-4 border-b py-3 px-6 lg:px-9">
				<span>
					<!-- TODO: ICON -->
					<Layers />
				</span>
				<span class="grow">{view.name}</span>
			</div>
		</a>
	{/each}
</div>
