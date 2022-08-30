<script lang="ts">
	import {
		Dialog,
		DialogOverlay,
		DialogTitle,
		DialogDescription,
		Transition,
		TransitionChild,
	} from '@rgossiaux/svelte-headlessui';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	export let isOpen = true;
	let className = '';
	export { className as class };
	let confirm_button: HTMLElement | null = null;
	$: console.log({ confirm_button });
	const dispatch = createEventDispatcher();
</script>

<Transition bind:show={isOpen} on:afterLeave={() => console.log('done')}>
	<Dialog class="relative z-50" on:close={() => (isOpen = false)} initialFocus={confirm_button}>
		<div class="fixed inset-0 z-50 overflow-y-auto">
			<TransitionChild
				enter="ease-out duration-200"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<DialogOverlay class="fixed inset-0 bg-gray-500/25 dark:bg-gray-900/40" />
			</TransitionChild>
			<div class="flex min-h-full items-end justify-center sm:items-center sm:p-4">
				<TransitionChild
					enter="ease-out duration-200"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div
						class="relative z-50 mx-auto flex h-[93vh] max-w-full flex-col space-y-3 rounded-t-xl bg-white px-5 py-3 text-gray-900 shadow-2xl ring-1 ring-black/5 dark:bg-gray-700 dark:text-gray-100 sm:h-auto sm:max-w-md sm:rounded-xl sm:py-4 {className}"
					>
						<div class="grid grid-cols-3">
							{#if $$slots.title}
								<DialogTitle class="col-span-1 col-start-2 place-self-center font-medium"
									><slot name="title" /></DialogTitle
								>
							{/if}
							<button
								class="col-span-1 col-start-3 place-self-end text-amber-500 dark:text-amber-600"
								on:click={() => (isOpen = false)}>Done</button
							>
						</div>
						{#if $$slots.description}
							<DialogDescription><slot name="description" /></DialogDescription>
						{/if}
						<slot />
					</div>
				</TransitionChild>
			</div>
		</div>
	</Dialog>
</Transition>
