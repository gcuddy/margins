<script>
	import { modals } from '$lib/stores/modals';
	import ModalContainer from './ModalContainer.svelte';

	$: console.log({ $modals });
</script>

{#each $modals as modal, i (i)}
	<ModalContainer isOpen={i === $modals.length - 1} {...modal.containerProps}>
		<svelte:component this={modal.component} {...modal.props} modalIndex={i} /></ModalContainer
	>
{/each}
