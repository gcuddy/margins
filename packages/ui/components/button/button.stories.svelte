<script lang="ts" context="module">
	import { Button, type Props } from '.';
	import type { Meta } from '@storybook/svelte';

	export const meta: Meta = {
		title: 'Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			size: {
				control: 'inline-radio',
				options: ['default', 'sm', 'lg', 'icon'],
			},
			variant: {
				control: 'inline-radio',
				options: ['default', 'outline', 'secondary', 'ghost', 'link'],
			},
		},
		parameters: {
			docs: {
				description: {
					component:
						'Buttons are controls that let users click or tap on elements. They are used to perform actions, such as submitting a form, opening a dialog, or playing a video. They can also be used to navigate between pages.',
				},
			},
		},
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';

	// @ts-expect-error
	import Loader from 'lucide-svelte/icons/loader';
	// @ts-expect-error
	import Mail from 'lucide-svelte/icons/mail';
	// @ts-expect-error
	import SquarePen from 'lucide-svelte/icons/square-pen';

	let count = 0;
	function handleClick() {
		count += 1;
	}

	let defaultProps = {};
	let outlineProps: Props = { variant: 'outline' };
	let secondaryProps: Props = { variant: 'secondary' };
	let ghostProps: Props = { variant: 'ghost' };
	let linkProps: Props = { variant: 'link' };
</script>

<Template let:args>
	<!--👇 'on:click' allows to forward event to addon-actions  -->
	<Button {...args} on:click on:click={handleClick}>
		You clicked: {count}
	</Button>
</Template>

<Story
	name="Primary"
	parameters={{
		docs: {
			description: {
				story:
					' In general, there should only be one Primary button per app context.',
			},
		},
	}}
	args={defaultProps}
/>
<Story name="Secondary" args={secondaryProps} />
<Story name="Outline" args={outlineProps} />
<Story name="Ghost" args={ghostProps} />
<Story name="Link" args={linkProps} />

<Story name="Loading">
	<Button>
		<Loader class="mr-2 h-4 w-4 animate-spin" />
		Loading</Button
	>
</Story>

<Story name="With Icon">
	<Button variant="secondary">
		<Mail class="mr-2 h-4 w-4" />
		Login with Email Button</Button
	>
</Story>

<Story name="Icon" args={{
    size: "icon",
    variant: "secondary"
}} let:args>
	<Button {...args}>
		<SquarePen class="h-4 w-4" /></Button
	>
</Story>
