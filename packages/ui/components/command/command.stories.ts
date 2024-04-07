import type { Meta, StoryObj } from '@storybook/svelte';

import Command from './command.test.svelte';
import CommandDialog from './command-dialog.test.svelte';

const meta = {
	component: Command,
	tags: ['autodocs'],
	title: 'UI/Command',
} satisfies Meta<Command>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	argTypes: {},
	args: {},
	name: 'Default',
};

export const Dialog: StoryObj<CommandDialog> = {
	argTypes: {
		open: {
			control: { type: 'boolean' },
		},
	},
	args: {
		open: true,
	},
	name: 'Dialog',
	render: (props) => ({
		Component: CommandDialog,
		props,
	}),
};
