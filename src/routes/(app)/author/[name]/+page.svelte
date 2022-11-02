<script lang="ts">
	import { page } from '$app/stores';
	import H1 from '$lib/components/atoms/H1.svelte';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: console.log({ data });
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			<SmallPlus>{$page.params.name}</SmallPlus>
		</div>
	</DefaultHeader>
</Header>

<Saved articles={data.articles} />
