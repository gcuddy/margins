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
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import { Loader, Mail } from 'lucide-svelte';
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

<Story name="Default" args={defaultProps} />
<Story name="Outline" args={outlineProps} />
<Story name="Secondary" args={secondaryProps} />
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
