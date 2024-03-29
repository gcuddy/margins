import type { Meta, StoryObj } from '@storybook/svelte';

import Command from './command.test.svelte';

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
