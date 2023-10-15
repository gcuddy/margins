<script lang="ts">
	import * as Form from '$components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';

	import { appearanceFormSchema, type AppearanceFormSchema } from './form';
	import { Label } from '$components/ui/label';
	import { objectEntries } from '$lib/helpers';
	import { isTheme, themes, updateTheme } from '$lib/features/settings/themes';
	import { page } from '$app/stores';

	export let form: SuperValidated<AppearanceFormSchema>;
</script>

<Form.Root
	action="/tests?/setTheme&redirectTo={$page.url.pathname}"
	method="POST"
	class="space-y-8"
	{form}
	schema={appearanceFormSchema}
	let:config
	debug={false}
	options={{
		onSubmit({ formData }) {
			const theme = formData.get('theme');
            if (theme && typeof theme === "string" && isTheme(theme)) {
                updateTheme(theme);
            }
		},
	}}
>
	<Form.Field {config} name="theme">
		<Form.Item>
			<Form.Label>Theme</Form.Label>
			<Form.Description>Select your interface theme.</Form.Description>
			<Form.Validation />
			<Form.RadioGroup
				class="grid grid-cols-2 gap-8 pt-2"
				orientation="horizontal"
			>
				{#each objectEntries(themes) as [label, theme]}
					<Label
						for={theme}
						class="[&:has([data-state=checked])>div]:border-primary"
					>
						<Form.RadioItem id={theme} value={theme} class="sr-only" />
						<div
							class="items-center rounded-md border-2 border-muted p-1 hover:border-accent"
						>
							<div data-theme={theme}>
								<div class="space-y-2 rounded-sm bg-secondary p-2">
									<div class="space-y-2 rounded-md bg-background p-2 shadow-sm">
										<div
											class="h-2 w-[80px] rounded-lg bg-secondary-foreground"
										/>
										<div
											class="h-2 w-[100px] rounded-lg bg-secondary-foreground"
										/>
									</div>
									<div
										class="flex items-center space-x-2 rounded-md bg-background p-2 shadow-sm"
									>
										<div class="h-4 w-4 rounded-full bg-muted-foreground" />
										<div class="h-2 w-[100px] rounded-lg bg-muted-foreground" />
									</div>
									<div
										class="flex items-center space-x-2 rounded-md bg-background p-2 shadow-sm"
									>
										<div class="h-4 w-4 rounded-full bg-muted-foreground" />
										<div class="h-2 w-[100px] rounded-lg bg-muted-foreground" />
									</div>
								</div>
							</div>
						</div>
						<span class="block w-full p-2 text-center font-normal">
							{label}
						</span>
					</Label>
				{/each}
			</Form.RadioGroup>
		</Form.Item>
	</Form.Field>
	<Form.Button>Save</Form.Button>
</Form.Root>
