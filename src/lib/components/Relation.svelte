<script lang="ts">
	import type { Entry, Relation } from '@prisma/client';
	import Badge from './ui/Badge.svelte';
	import type { ComponentType } from 'svelte';
	import { ArrowLeft, ArrowRightLeft } from 'lucide-svelte';
	import { getId, getType } from '$lib/utils/entries';

	const icons: Record<Relation['type'], ComponentType> = {
		Related: ArrowRightLeft,
		SavedFrom: ArrowLeft
	};

	export let type: Relation['type'];
	export let entry: Pick<
		Entry,
		'type' | 'id' | 'tmdbId' | 'googleBooksId' | 'spotifyId' | 'podcastIndexId' | 'title'
	>;
</script>

<Badge as="a" href="/tests/{getType(entry.type)}/{getId(entry)}">
	<svelte:component this={icons[type]} class="mr-2 h-4 w-4" />
	<span class="text-xs">{entry.title}</span>
</Badge>
