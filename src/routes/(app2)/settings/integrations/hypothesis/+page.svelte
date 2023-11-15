<script lang="ts">
	import * as Card from '$components/ui/card';
	import { Checkbox } from '$components/ui/checkbox';
	import * as Form from '$components/ui/form';
	import { superForm } from 'sveltekit-superforms/client';
	import { hypothesisSchema } from './schema';
	import { Button } from '$components/ui/button';

	export let data;

	const {
		form: settingsForm,
		enhance,
		submitting,
	} = superForm(data.settingsForm, {
		dataType: 'json',
		onUpdated({ form }) {
			form.message;
		},
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>API Key</Card.Title>
	</Card.Header>
	<Card.Content>
		<Form.Root
			action="?/apiKey"
			method="post"
			schema={hypothesisSchema}
			form={data.form}
			let:config
			class="space-y-6"
			let:submitting
		>
			<Form.Item>
				<Form.Field {config} name="apiKey">
					<Form.Label>Hypothes.is API Key</Form.Label>
					<Form.Input placeholder="API Key" />
					<Form.Description>
						You can find your API key on your <a
							class="underline"
							href="https://hypothes.is/account/developer"
							target="_blank">Hypothes.is developer settings page</a
						> (must be logged in).
					</Form.Description>
					<Form.Validation />
				</Form.Field>
			</Form.Item>
			<Form.Button disabled={submitting}>Save</Form.Button>
		</Form.Root>
	</Card.Content>
</Card.Root>

{#if data.profile}
	<section class="space-y-4">
		<h2 class="text-xl font-semibold tracking-tight">Groups to import</h2>
		<form action="?/settings" method="post" use:enhance>
			<ul class="space-y-2">
				{#each data.profile.groups as group}
					<li class="flex items-center gap-4">
						<!-- Checked: If integration.settings does not exist, or if in integration.settings.groups -->
						<!-- TODO: hook this up with form... ? -->
						<Checkbox
							onCheckedChange={() => {
								if ($settingsForm.groups.includes(group.id)) {
									$settingsForm.groups = $settingsForm.groups.filter(
										(id) => id !== group.id,
									);
								} else {
									$settingsForm.groups = [...$settingsForm.groups, group.id];
								}
							}}
							checked={$settingsForm.groups.includes(group.id)}
						/>
						<svelte:element
							this={group.url ? 'a' : 'span'}
							class="font-medium tracking-tight {group.url
								? 'hover:text-primary'
								: ''}"
							href={group.url}>{group.name}</svelte:element
						>
					</li>
				{/each}
			</ul>
			<Button disabled={$submitting} type="submit">Save</Button>
		</form>
	</section>
{/if}
