<script lang="ts">
	import DialogClose from './dialog-close.svelte';
	import DialogContent from './dialog-content.svelte';
	import DialogFooter from './dialog-footer.svelte';
	import DialogHeader from './dialog-header.svelte';
	import { Dialog } from './index.js';
	import type { ComponentProps } from 'svelte';

	export let open = true;
	export let title = 'Dialog Title';
	export let description = 'Dialog Description';
	export let onClick: ComponentProps<DialogClose>['onClick'] = undefined;
	export let showX = true;
</script>

<Dialog bind:open>
	<DialogContent {showX}>
		<DialogHeader {title} {description}></DialogHeader>
		<p>Content goes here</p>
		<DialogFooter>
			<DialogClose {onClick}>Close</DialogClose>
		</DialogFooter>
	</DialogContent>
</Dialog>
