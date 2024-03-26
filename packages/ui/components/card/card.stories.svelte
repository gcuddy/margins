<script lang="ts" context="module">
	import { Card, CardFooter } from './index.js';
	import type { Meta } from '@storybook/svelte';

	export const meta: Meta = {
		component: Card,
		parameters: {
			docs: {
				description: {
					component: 'Displays a card with header, content, and footer.',
				},
			},
		},
		tags: ['autodocs'],
		title: 'Card',
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import CardContent from './card-content.svelte';

let defaultProps = {
		description: 'Description',
		title: 'Title',
	};
</script>

<Template let:args>
	<!--👇 'on:click' allows to forward event to addon-actions  -->
	<Card {...args} class="w-72">
		<CardContent>Content goes here</CardContent>
		<CardFooter>
			<p>Footer content</p>
		</CardFooter>
	</Card>
</Template>

<Story name="Basic" args={defaultProps}></Story>
