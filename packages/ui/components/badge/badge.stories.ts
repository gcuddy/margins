import type { Meta, StoryObj } from '@storybook/svelte';

import Badge from './badge.test.svelte';

import Plus from 'lucide-svelte/icons/plus';

const meta = {
	component: Badge,
	tags: ['autodocs'],
	title: 'UI/Badge',
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['default', 'outline', 'secondary', 'destructive'],
		},
	},
	args: {
		label: 'Test Badge',
	},
	name: 'Default',
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
