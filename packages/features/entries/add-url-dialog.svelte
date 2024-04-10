<script lang="ts">
	export let open = false;
	export let showButton = true;
	import { Button, Dialog } from '@margins/ui';
	import PlusCircle from 'lucide-svelte/icons/circle-plus';
	import AddUrlForm from './add-url-form.svelte';
	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<Dialog.Root bind:open>
	{#if showButton}
		<Dialog.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				class={className}
				variant="outline"
				size="sm"
			>
				<PlusCircle class="text-muted-foreground mr-2 h-4 w-4" />
				Add URL</Button
			>
		</Dialog.Trigger>
	{/if}
	<Dialog.Content>
		<AddUrlForm action="?" onSuccess={() => (open = false)} />
	</Dialog.Content>
</Dialog.Root>
