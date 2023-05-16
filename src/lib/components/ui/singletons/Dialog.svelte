<script lang="ts" context="module">
	type StringOrComponent =
		| string
		| {
				component: ComponentType;
				props?: Record<string, any>;
                events?: Record<string, any>;
		  };
	export type State = {
		isOpen: boolean;
		content?: StringOrComponent;
		title?: string;
		description?: string;
		footer?: StringOrComponent;
	};

	function dialog_store() {
		const { subscribe, set, update } = writable<State>({
			isOpen: false
		});

		const open = <
			TComponent extends SvelteComponentTyped,
			TFooterComponent extends SvelteComponentTyped
		>({
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
                        events?: ComponentEvents<TFooterComponent>;
				  };
		}) => {
			update((state) => {
				return {
					...state,
					isOpen: true,
					content,
					title,
					description,
					footer
				};
			});
		};

		const close = () => {
			update((state) => {
				return {
					...state,
					isOpen: false,
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
	import type { ComponentEvents, ComponentProps, ComponentType, SvelteComponentTyped } from 'svelte';

	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogDescription
	} from '$lib/components/ui/dialog';
	import Portal from 'svelte-portal';
	import { writable } from 'svelte/store';
</script>

<Dialog bind:isOpen={$state.isOpen}>
	<DialogContent>
		<slot name="header">
			{#if $state.title || $state.description}
				<DialogHeader>
					{#if $state.title}
						<DialogTitle>
							{@html $state.title}
						</DialogTitle>
					{/if}
					{#if $state.description}
						<DialogDescription>
							{@html $state.description}
						</DialogDescription>
					{/if}
				</DialogHeader>
			{/if}
		</slot>
		<slot>
			{#if $state.content}
				{#if typeof $state.content === 'string'}
					{@html $state.content}
				{:else}
					<svelte:component this={$state.content.component} {...$state.content.props} />
				{/if}
			{/if}
		</slot>
		<slot name="footer">
			<DialogFooter>
				<slot name="footer">
					{#if $state.footer}
						{#if typeof $state.footer === 'string'}
							{@html $state.footer}
						{:else}
							<svelte:component this={$state.footer.component} {...$state.footer.props} />
						{/if}
					{/if}
				</slot>
			</DialogFooter>
		</slot>
	</DialogContent>
</Dialog>
