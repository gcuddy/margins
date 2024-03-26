import type { Meta, StoryObj } from '@storybook/svelte';

import Dialog from './dialog.test.svelte';

const meta: Meta<Dialog> = {
	argTypes: {
		description: {
			control: { type: 'text' },
		},
		open: {
			control: { type: 'boolean' },
		},
		showX: {
			control: { type: 'boolean' },
		},
		title: {
			control: { type: 'text' },
		},
	},
	component: Dialog,
	render: (props) => ({
		Component: Dialog,
		props: {
			...props,
			onClick: () => {
				const currentUrl = new URL(window.location.href);
				currentUrl.searchParams.set('args', 'open:false');
				window.open(currentUrl.toString(), '_self');
				// onClick();
			},
		},
	}),
	title: 'UI/Dialog',
};

export default meta;

type Story = StoryObj<Dialog>;

export const Default: Story = {
	args: {
		description: 'This is an example dialog',
		open: true,
		showX: true,
		title: 'Example Dialog',
	},
	name: 'Dialog',
};
