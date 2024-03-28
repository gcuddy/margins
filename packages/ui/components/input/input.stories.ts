import type { Meta, StoryObj } from '@storybook/svelte';

import Input from './input.svelte';

const meta = {
	argTypes: {
		type: {
			control: { type: 'select' },
			options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
		},
	},
	component: Input,
	tags: ['autodocs'],
	title: 'UI/Input',
} satisfies Meta<Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		class: 'max-w-sm',
		placeholder: 'Placeholder',
		type: 'text',
	},
	name: 'Default',
};
