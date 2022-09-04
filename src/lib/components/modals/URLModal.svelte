<script lang="ts">
	import type { Pending, Result } from '$lib/actions/form';
	import { notifications, type INotification } from '$lib/stores/notifications';
	import { modals } from '$lib/stores/modals';
	import { invalidate } from '$app/navigation';
	import Spinner from '../Spinner.svelte';
	import Icon from '../helpers/Icon.svelte';
	import Form from '../Form.svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/stores/user';

	export let term = '';
	export let placeholder = 'Enter URL...';
	export let formAction = '/add';
	export let pending: Pending = async ({ form }) => {
		modals.close(modalIndex);
		pending_notification = notifications.notify({
			message: 'Adding article...',
		});
		console.log('pending');
	};
	export let done: Result = async ({ form, response }) => {
		notifications.remove(pending_notification);
		await user.updateData('articles', { access_token: $page.data.lucia.access_token });
		if (inv) {
			invalidate(inv).then(() => {
				console.log(`invalidated ${inv}`);
			});
		}
		// form.reset();
		// pending = false;
		modals.close();
		if (notification) {
			notifications.notify(notification);
		}
		const location = response.headers.get('Location');
		notifications.notify({
			message: `Article added to your inbox`,
			title: 'Article added',
			link: {
				href: location,
				text: 'View article',
			},
			type: 'success',
		});
	};
	let inv: string | undefined = undefined;
	export { inv as invalidate };
	export let notification: Parameters<typeof notifications['notify']>[0] | undefined = undefined;
	export let name = 'text';
	let headers = new Headers();
	$: headers.set('Authorization', `Bearer ${$page.data.lucia.access_token}`);
	$: console.log({ $page });

	let input: HTMLInputElement;
	let pending_notification: string;
	export let modalIndex: number;
</script>

<div class="w-full p-2">
	<Form
		action={formAction}
		method="post"
		{headers}
		{pending}
		{done}
		error={async ({ form }) => {
			notifications.remove(pending_notification);
			notifications.notify({ message: 'Error adding URL', type: 'error' });
			// form.reset();
			// input.focus();
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
				class="absolute right-4 top-0 flex h-full flex-col justify-center opacity-0 transition-opacity"
			>
				<Icon name="loading" className="h-5 w-5 text-primary-600" />
			</div>
		</div>
	</Form>
</div>
