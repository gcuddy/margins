<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CollectionEntry from '$lib/components/CollectionEntry.svelte';
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: articles = data.articles;
</script>

<CollectionEntry />
