<script lang="ts">
	import Editor from '$components/ui/editor/Editor.svelte';
</script>

<div>
	<Editor
		content={` <p>
    This is still the text editor you’re used to, but enriched with node views.
  </p>
  <margins-flashcard>
  </margins-flashcard>
  <p>
    Did you see that? That’s a JavaScript node view. We are really living in the future.
  </p>
    `}
	/>
</div>

<style lang="postcss">
	div {
		:global(.node-view) {
			background: #faf594;
			border: 3px solid #0d0d0d;
			border-radius: 0.5rem;
			margin: 1rem 0;
			position: relative;
		}

		:global(.label) {
			margin-left: 1rem;
			background-color: #0d0d0d;
			font-size: 0.6rem;
			letter-spacing: 1px;
			font-weight: bold;
			text-transform: uppercase;
			color: #fff;
			position: absolute;
			top: 0;
			padding: 0.25rem 0.75rem;
			border-radius: 0 0 0.5rem 0.5rem;
		}

		:global(.content) {
			margin: 2.5rem 1rem 1rem;
			padding: 0.5rem;
			border: 2px dashed #0d0d0d20;
			border-radius: 0.5rem;
		}
	}
</style>
