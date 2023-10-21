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
		class?: string;
		/** What to render the element as. Defaults to "button" */
// as?: string;
		text?: string;
		// onclick?: (state: State) => void;
	};

	type StringOrComponent =
		| string
		| {
				component: ComponentType;
				events?: Record<string, any>;
				props?: Record<string, any>;
		  };

	export type State = {
		content?: StringOrComponent;
		description?: string;
		footer?: StringOrComponent | Array<Element>;
		open: Writable<boolean>;
		title?: string;
	};

	function dialog_store() {
		// let { trigger, portal, overlay, content, title, description, close, open } = dialog;

		const { set, subscribe, update } = writable<State>({
			open: writable(false)
		});

		const open = <TComponent extends SvelteComponent, TFooterComponent extends SvelteComponent>({
			content,
			description,
			footer,
			title
		}: {
			content:
				| string
				| {
						component: ComponentType<TComponent>;
						props?: ComponentProps<TComponent>;
				  };
			description?: string;
			footer?:
				| string
				| {
						component: ComponentType<TFooterComponent>;
						props?: ComponentProps<TFooterComponent>;
				  }
				| Array<Element>;
			title?: string;
		}) => {
			update((state) => {
				console.log({ state });
				state.open.set(true);
				return {
					...state,
					content,
					description,
					footer,
					title
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
			close,
			open,
			set,
			subscribe,
			update
		};
	}

	const state = dialog_store();
	export { state as dialog_store };
</script>

<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';
	import type { ComponentType } from 'svelte';
	import { type Writable, writable } from 'svelte/store';

	// accept title, description
	// content (can be html or svelte component or store component with props)
	// allow footer to be passed in: svelte component or store component with props, or button(s) with onclick prop
	import Dialog from './Dialog.svelte';

	const dialog = createDialog();
	// on initialization, set open state to dialog open
	state.set({
		open: dialog.states.open
	});

	$: close = dialog.elements.close;
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
                            dialog.states.open.set(false);
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
