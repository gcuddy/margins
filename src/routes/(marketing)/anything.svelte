<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const words = [
		'articles',
		'books',
		'pdfs',
		'bookmarks',
		'podcasts',
		'rss',
		'anything.',
	];

	let index = 0;

	onMount(() => {
		const interval = setInterval(() => {
			index = index + 1;
			if (index === words.length - 1) {
				clearInterval(interval);
			}
		}, 2000);
	});
</script>

<span class="grid-word relative"
	>{#key index}
		<span
			in:fade={{
				delay: 200,
			}}
			out:fade={{
				duration: 200,
			}}
			class="italic">{words[index]}</span
		>
	{/key}</span
>

<style>
	.grid-word {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}

	.grid-word > * {
		grid-column: 1;
		grid-row: 1;
	}
</style>
