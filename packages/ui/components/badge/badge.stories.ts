import type { Meta, StoryObj } from '@storybook/svelte';

import Badge from './badge.test.svelte';

import Plus from 'lucide-svelte/icons/plus';

const meta = {
	component: Badge,
	tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: 'Default',
	args: {
		label: 'Test Badge',
	},
	argTypes: {
		variant: {
			options: ['default', 'outline', 'secondary', 'destructive'],
			control: { type: 'select' },
		},
	},
};

export const WithIcon: Story = {
	render: () => ({
		Component: Badge,
		props: {
			startIcon: Plus,
		},
	}),
};

export const WithDot: Story = {
	render: () => ({
		Component: Badge,
		props: {
			withDot: true,
		},
	}),
};
