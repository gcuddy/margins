<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import SrsCard from '../srs-card.svelte';

	export let data;

	let note_index = 0;

	let completed = false;

	$: console.log({ data, note_index });

</script>

<!-- Load First -->

<!-- TODO: when a note is forgotten, it's scheduled at end of session, so we shuold be constantly refreshing that

(or we can just get the next note to review one at a time on the server)

-->

{#if data.notes_to_review.length && !completed}
	{#key data.notes_to_review.length}
		<div>
			<SrsCard
				note={data.notes_to_review[0]}
				on:done={({ detail }) => {
					if (detail.type === 'Forgotten') {
						// data.notes_to_review.push(data.notes_to_review[note_index]);
						// data.notes_to_review = data.notes_to_review;
					}
                    // splice out first note
                    data.notes_to_review.splice(0, 1);
                    data.notes_to_review = data.notes_to_review;
                    console.log({data})
					// if (note_index < data.notes_to_review.length - 1) {
					// 	note_index++;
					// } else if (data.notes_to_review.length) {
					// 	completed = true;
					// }
					// invalidate
					invalidate('review');
				}}
			/>
		</div>
	{/key}
{:else}
	<div>
		<h1>Completed</h1>
		<p>There are no more notes to review.</p>
	</div>
	<!-- TODO: confetti -->
{/if}
