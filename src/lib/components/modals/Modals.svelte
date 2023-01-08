<script>
	import { modals } from '$lib/stores/modals';
	import ModalContainer from './ModalContainer.svelte';

	$: console.log({ $modals });
</script>

{#each $modals as modal, i (modal.id || i)}
	<ModalContainer {modal}>
		<svelte:component this={modal.component} {...modal.props} modalIndex={i} /></ModalContainer
	>
{/each}
