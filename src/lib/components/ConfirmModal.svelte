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
	let confirm_button: HTMLElement | undefined = undefined;
	$: console.log({ confirm_button });
    export let description = "";
	export let confirmText = 'Confirm';
    export let onConfirm = () => {};
	const dispatch = createEventDispatcher();
</script>

<Transition bind:show={isOpen} on:afterLeave={() => console.log('done')}>
	<Dialog on:close={() => (isOpen = false)} initialFocus={confirm_button}>
		<div class="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]">
			<TransitionChild
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<DialogOverlay class="fixed inset-0 bg-gray-500/25 dark:bg-gray-900/40" />
			</TransitionChild>
			<TransitionChild
				enter="ease-out duration-300"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			>
				<div
					class="relative z-50 mx-auto flex max-w-md flex-col rounded-xl bg-gray-50 p-5 text-gray-900 shadow-2xl ring-1 ring-black/5 dark:bg-gray-700 dark:text-gray-100 space-y-2{className}"
				>
					{#if $$slots.title}
						<DialogTitle class="place-self-center font-medium"><slot name="title" /></DialogTitle>
					{/if}
					{#if $$slots.description}
						<DialogDescription><slot name="description" /></DialogDescription>
					{/if}
					<slot>
                        {description}
                    </slot>
					<div class="flex justify-end ">
						<div class="flex flex-row-reverse gap-2">
							<Button
								on:click={() => {
									dispatch('confirm');
                                    onConfirm();
									isOpen = false;
								}}
								className="focus:ring focus-visible:ring active:ring"
								bind:el={confirm_button}>{confirmText}</Button
							>
							<Button
								on:click={() => {
									isOpen = false;
								}}
								variant="ghost">Cancel</Button
							>
						</div>
					</div>
				</div>
			</TransitionChild>
		</div>
	</Dialog>
</Transition>
