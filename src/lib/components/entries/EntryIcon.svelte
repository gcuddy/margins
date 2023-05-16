<script lang="ts">
	import type { Entry } from '@prisma/client';
	import {
		Dice6,
		FileAudio,
		Music4,
		Newspaper,
		Book,
		Bookmark,
		Gamepad,
		FileImage,
		Film,
		FileText,
		Podcast,
		Utensils,
		RssIcon,
		TvIcon,
		TwitterIcon,
		VideoIcon
	} from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	export let type: Entry['type'];

	const icons: Record<Entry['type'], ComponentType> = {
		album: Music4,
		article: Newspaper,
		audio: FileAudio,
		board_game: Dice6,
		book: Book,
		bookmark: Bookmark,
		epub: Book,
		game: Gamepad,
		image: FileImage,
		movie: Film,
		pdf: FileText,
		podcast: Podcast,
		playlist: Music4,
		recipe: Utensils,
		rss: RssIcon,
		song: Music4,
		tv: TvIcon,
		tweet: TwitterIcon,
		video: VideoIcon
	};

	let className = '';
	export { className as class };
</script>

<svelte:component this={icons[type]} class={className} />
