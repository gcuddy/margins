<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import { onDestroy, onMount } from 'svelte';
	import type { Editor } from 'svelte-tiptap';
	import { Check, Trash } from 'lucide-svelte';
	import { writable } from 'svelte/store';

	export let editor: Editor;

	export let open = writable(false);
	let input: HTMLInputElement;

	let url = editor.getAttributes('link').href || '';

	$: if ($open) {
		setTimeout(() => {
			// focus
			input?.focus();
		}, 0);
	}
</script>

<svelte:window on:keydown={(e) => {
	if (e.key === 'k' && e.metaKey) {
		$open = true;
	}
}} />

<div class="relative">
	<button
		class="flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
		on:click={() => {
			$open = !$open;
		}}
	>
		<p class="text-base">↗</p>
		<p
			class={cn('underline decoration-stone-400 underline-offset-4', {
				'text-red-500': editor.isActive('link')
			})}
		>
			Link
		</p>
	</button>
	{#if $open}
		<form
			class="fixed top-full z-[99999] mt-1 flex w-60 overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
			on:submit={(e) => {
				console.log('SUBMITING!');
				e.preventDefault();
				editor.chain().focus().setLink({ href: url }).run();
				$open = false;
			}}
		>
			<input
				bind:this={input}
				type="url"
				bind:value={url}
				placeholder="Paste a link"
				class="flex-1 p-1 text-sm outline-none"
			/>

			{#if editor.getAttributes('link').href}
				<button
					class="flex items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100"
					on:click={() => {
						editor.chain().focus().unsetLink().run();
						$open = false;
					}}
				>
					<Trash className="h-4 w-4" />
				</button>
			{:else}
				<button
					type="submit"
					on:click={() => {
						console.log('hellooo');
						editor.chain().focus().setLink({ href: url }).run();
				$open = false;
					}}
					class="flex items-center rounded-sm p-1 text-stone-600 transition-all hover:bg-stone-100"
				>
					<Check class="h-4 w-4" />
				</button>
			{/if}
			<!-- df -->
		</form>
	{/if}
</div>
