<script lang="ts">
	import { enhance } from '$app/forms';
	import LogInteractionForm from '$components/entries/interaction-form/log-interaction-form.svelte';
	import { Button } from '$components/ui/button';

	export let data;
</script>

<!-- constructing our own form for speed and bundle size -->
{#if data.interaction.entry}
	<LogInteractionForm
		entry={data.interaction?.entry ?? undefined}
		form={{
			constraints: {},
			errors: {},
			data: {
				entryId: data.interaction?.entry?.id,
				// TODO: rn we say this because we are guaranteed to have the entryid, and this ensures we don't go looking
				type: 'article',
				finished: data.interaction.finished
					? new Date(data.interaction.finished).toISOString().slice(0, 10)
					: undefined,
				note: data.interaction.note ?? undefined,
				rating: data.interaction.rating ?? undefined,
				revisit: Boolean(data.interaction.revisit),
				// started: data.interaction.started ?? undefined,
				// title: data.interaction.title ?? undefined,
			},
			posted: false,
			valid: true,
		}}
	>
		<svelte:fragment slot="footer" let:tainted>
			<Button
				on:click={(e) => {
					if (tainted) {
						if (
							!confirm(
								'Are you sure you want to cancel? You have unsaved changes.',
							)
						) {
							e.preventDefault();
						}
					}
				}}
				variant="ghost"
				href="/tests/a/{data.interaction.id}">Cancel</Button
			>
			<form
				method="post"
				action="?/delete"
				use:enhance={({ cancel }) => {
					if (!confirm('Are you sure you want to delete this interaction?')) {
						cancel();
					}
				}}
			>
				<Button variant="secondary">Delete</Button>
			</form>
		</svelte:fragment>
	</LogInteractionForm>
{:else}
	<!-- TODO -->
{/if}
