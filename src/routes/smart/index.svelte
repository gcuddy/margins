<script lang="ts">
	import Select from '$lib/components/atoms/Select.svelte';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Button from '$lib/components/Button.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import { useId } from '$lib/hooks/use-id';
	import type { SmartListCondition } from '$lib/types/filter';
	import type { Article, Prisma, SmartList } from '@prisma/client';

	export let lists: SmartList[] = [];
</script>

<!-- TODO: make work progressively enhanced with actual forms -->

<Header>
	<DefaultHeader>
		<div slot="start"><SmallPlus size="base">Smart Lists</SmallPlus></div>
		<div slot="end">
			<Button as="a" href="/smart/new" variant="ghost" className="flex"
				><Icon name="plusSmSolid" className="h-4 w-4 fill-current" /><span>Add List</span></Button
			>
		</div>
	</DefaultHeader>
</Header>
<div class="flex max-w-md flex-col ">
	{#each lists as list}
		<a href="/smart/{list.id}">{list.name}</a>
	{/each}
</div>
