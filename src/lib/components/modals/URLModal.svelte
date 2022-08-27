<script lang="ts">
	import { enhance } from '$lib/actions/form';
	import { notifications, type INotification } from '$lib/stores/notifications';
	import { modals } from '$lib/stores/modals';
	import { invalidate } from '$app/navigation';
	import Spinner from '../Spinner.svelte';
	import Icon from '../helpers/Icon.svelte';

	export let term = '';
	export let placeholder = 'Enter URL...';
	export let formAction = '/add';
	let inv = '/';
	export { inv as invalidate };
	export let notification: Parameters<typeof notifications['notify']>[0] | undefined = undefined;
	export let name = 'text';

	let input: HTMLInputElement;
	let pending = false;
</script>

<div class="w-full p-2">
	<form
		on:submit|preventDefault={() => console.log('submitted')}
		action={formAction}
		method="post"
		use:enhance={{
			pending: async ({ form }) => {
				console.log('pending');
				pending = true;
			},
			result: async ({ form, response }) => {
				await invalidate(inv);
				// form.reset();
				// pending = false;
				modals.close();
				if (notification) {
					notifications.notify(notification);
				}
				response.json().then(({ article }) => {
					notifications.notify({
						message: `<a href='/${article.id}'>${article.title}</a> <span class="text-gray-600 dark:text-gray-400">added to your inbox</span>`,
						title: 'Article added',
						link: {
							href: `/${article.id}`,
							text: 'View article',
						},
						type: 'success',
					});
				});
			},
			error: async ({ form }) => {
				pending = false;
				notifications.notify({ message: 'Error adding URL', type: 'error' });
				form.reset();
				input.focus();
			},
		}}
	>
		<!-- TODO: little css animation like Search? -->
		<div>
			<input
				{placeholder}
				{name}
				type="text"
				class="w-full border-0 bg-inherit focus:ring-0"
				bind:this={input}
				bind:value={term}
			/>
			<div
				class="absolute right-4 top-0 flex h-full flex-col justify-center opacity-0 transition-opacity {pending
					? '!opacity-100 animate-spin'
					: ''}"
			>
				<Icon name="loading" className="h-5 w-5 text-primary-600" />
			</div>
		</div>
	</form>
</div>
