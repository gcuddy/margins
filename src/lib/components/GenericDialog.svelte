<script lang="ts">
	import {
		Dialog,
		DialogDescription,
		DialogOverlay,
		DialogTitle,
		Transition,
		TransitionChild,
	} from "@rgossiaux/svelte-headlessui";
	export let isOpen = true;
	let className = "";
	export { className as class };
	export let done_button = true;
	let confirm_button: HTMLElement | null = null;
	$: console.log({ confirm_button });
</script>

<Transition bind:show={isOpen} on:afterEnter on:afterLeave>
	<Dialog class="relative z-50" on:close={() => (isOpen = false)}>
		<div class="fixed inset-0 z-50 overflow-y-auto">
			<TransitionChild
				enter="ease-out duration-200"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<DialogOverlay
					class="fixed inset-0 bg-base/50 backdrop-blur-sm transition-all"
				/>
			</TransitionChild>
			<div
				class="flex min-h-full items-end justify-center sm:items-center sm:p-4"
			>
				<TransitionChild
					enter="ease-out duration-200"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div
						class="relative z-50 mx-auto flex h-[93vh] max-w-full flex-col space-y-3 rounded-t-xl bg-elevation px-5 py-3 text-content shadow-2xl ring-1 ring-border/50 dark:text-gray-100 sm:h-auto sm:max-w-md sm:rounded-xl sm:py-4 {className}"
					>
						{#if done_button || $$slots.title}
							<div class="grid grid-cols-3">
								{#if $$slots.title}
									<DialogTitle
										class="col-span-1 col-start-2 place-self-center font-medium text-content"
										><slot name="title" /></DialogTitle
									>
								{/if}
								{#if done_button}
									<button
										class="col-span-1 col-start-3 place-self-end text-amber-500 dark:text-amber-600"
										on:click={() => (isOpen = false)}>Done</button
									>
								{/if}
							</div>
						{/if}
						{#if $$slots.description}
							<DialogDescription class="text-current"
								><slot name="description" /></DialogDescription
							>
						{/if}
						<slot />
						<slot name="bottom" />
					</div>
				</TransitionChild>
			</div>
		</div>
	</Dialog>
</Transition>
