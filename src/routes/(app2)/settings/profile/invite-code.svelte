<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';

	export let code: string;

	import { Confetti } from 'svelte-confetti';
	import { toast } from 'svelte-sonner';

	let copied = false;
	let confetti = false;

    $: url = `${$page.url.origin}/i/${code}`
</script>

<div class="flex gap-4 items-center">
	<Input
		class="w-full select-all {copied ? 'bg-primary text-primary-foreground' : ''}"
		type="text"
		value={url}
		readonly
	/>
	<Button
		on:click={() => {
			console.log('copying');
			navigator.clipboard.writeText(url);
            toast.success('Copied invitation link to clipboard! Go ahead and share it with a friend.', {
                description: 'Go ahead and share it with a friend.'
            });
			copied = true;
			confetti = true;
			setTimeout(() => {
				copied = false;
				confetti = false;
			}, 2000);
		}}
		class="w-min"
		variant="secondary"
	>
		Copy
		{#if confetti}
			<Confetti />
		{/if}
	</Button>
</div>
