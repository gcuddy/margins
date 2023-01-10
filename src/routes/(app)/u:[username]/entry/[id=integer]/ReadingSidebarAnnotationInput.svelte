<script>
	import AnnotationInput from '$lib/components/annotations/AnnotationInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { createEventDispatcher } from 'svelte';
	export let busy = false;
	const dispatch = createEventDispatcher();
	export let value = '';
</script>

<AnnotationInput
	placeholder="Add a page note…"
	rows={1}
	bind:value
	shadow_focus={true}
	include_tags={false}
	confirmButtonStyle="ghost"
	class="text-sm"
>
	<svelte:fragment slot="buttons">
		<Button
			type="reset"
			on:click={() => dispatch('cancel')}
			variant="ghost"
			size="sm"
			className="text-sm">Cancel</Button
		>
		<Button type="submit" disabled={busy} variant="ghost" size="sm" className="text-sm"
			>{#if busy}
				<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
			{:else}
				Save
			{/if}
		</Button>
	</svelte:fragment>
</AnnotationInput>
