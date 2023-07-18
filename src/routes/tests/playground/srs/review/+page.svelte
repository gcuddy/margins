<script lang="ts">
	import Card from '../Card.svelte';

	export let data;

	let note_index = 0;

	let completed = false;
</script>

<!-- Load First -->

<!-- TODO: when a note is forgotten, it's scheduled at end of session, so we shuold be constantly refreshing that

(or we can just get the next note to review one at a time on the server)

-->

{#if data.notes_to_review.length && !completed}
	<Card
		note={data.notes_to_review[note_index]}
		on:done={({ detail }) => {
			if (detail.type === 'Forgotten') {
				data.notes_to_review.push(data.notes_to_review[note_index]);
				data.notes_to_review = data.notes_to_review;
			}
			if (note_index < data.notes_to_review.length - 1) {
				note_index++;
			} else {
				completed = true;
			}
		}}
	/>
{:else}
	<div>
		<h1>Completed</h1>
		<p>There are no more notes to review.</p>
	</div>
	<!-- TODO: confetti -->
{/if}
