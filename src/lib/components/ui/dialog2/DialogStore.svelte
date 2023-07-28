<script lang="ts" context="module">
	import type { ComponentProps, SvelteComponent } from 'svelte';

	type ButtonElement = {
		as: 'button' | undefined;
		onclick?: (state: State) => void;
	};

	// type AnyOtherElement = {
	// 	as: string;
	// 	onclick: never;
	// };

	type Element = ButtonElement & {
		/** What to render the element as. Defaults to "button" */
		// as?: string;
		text?: string;
		class?: string;
		// onclick?: (state: State) => void;
	};

	type StringOrComponent =
		| string
		| {
				component: ComponentType;
				props?: Record<string, any>;
				events?: Record<string, any>;
		  };

	export type State = {
		open: Writable<boolean>;
		content?: StringOrComponent;
		title?: string;
		description?: string;
		footer?: StringOrComponent | Element[];
	};

	function dialog_store() {
		// let { trigger, portal, overlay, content, title, description, close, open } = dialog;

		const { subscribe, set, update } = writable<State>({
			open: writable(false)
		});

		const open = <TComponent extends SvelteComponent, TFooterComponent extends SvelteComponent>({
			content,
			title,
			description,
			footer
		}: {
			title?: string;
			description?: string;
			content:
				| string
				| {
						component: ComponentType<TComponent>;
						props?: ComponentProps<TComponent>;
				  };
			footer?:
				| string
				| {
						component: ComponentType<TFooterComponent>;
						props?: ComponentProps<TFooterComponent>;
				  }
				| Element[];
		}) => {
			update((state) => {
				console.log({ state });
				state.open.set(true);
				return {
					...state,
					content,
					title,
					description,
					footer
				};
			});
		};

		const close = () => {
			update((state) => {
				state.open.set(false);
				return {
					...state,
					content: undefined
				};
			});
		};

		return {
			subscribe,
			set,
			update,
			open,
			close
		};
	}

	const state = dialog_store();
	export { state as dialog_store };
</script>

<script lang="ts">
	import type { ComponentType } from 'svelte';
	// accept title, description
	// content (can be html or svelte component or store component with props)
	// allow footer to be passed in: svelte component or store component with props, or button(s) with onclick prop

	import Dialog from './Dialog.svelte';
	import { Writable, writable } from 'svelte/store';
	import { createDialog } from '@melt-ui/svelte';

	let dialog = createDialog();
	// on initialization, set open state to dialog open
	state.set({
		open: dialog.open
	});

	$: close = dialog.close;
</script>

<Dialog {dialog} title={$state.title} description={$state.description}>
	<!-- Content -->
	{#if typeof $state.content === 'string'}
		{@html $state.content}
	{:else if $state.content}
		<svelte:component this={$state.content.component} {...$state.content.props} />
	{/if}

	<!-- Footer -->
	<svelte:fragment slot="footer">
		{#if typeof $state.footer === 'string'}
			{@html $state.footer}
		{:else if $state.footer && 'component' in $state.footer}
			<svelte:component this={$state.footer.component} {...$state.footer.props} />
		{:else if $state.footer}
			{#each $state.footer as el}
				{#if el.as === 'button'}
					<!-- render an actual button, because on:click doesn't seem to work... -->
                    <!-- use:close
                    {...$close} -->
					<button
						class={el.class}
						on:click={() => {
							el.onclick?.($state);
                            dialog.open.set(false);
						}}
					>
						{el.text}
					</button>
				{:else}
					<svelte:element
						this={el.as || 'button'}
						role={el.as === 'button' ? 'button' : undefined}
						use:close
						{...$close}
						class={el.class}
						on:click={() => el.onclick?.($state)}>{el.text}</svelte:element
					>
				{/if}
			{/each}
		{/if}
	</svelte:fragment>
</Dialog>
