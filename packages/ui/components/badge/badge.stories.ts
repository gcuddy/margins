import type { Meta, StoryObj } from '@storybook/svelte';

import Badge from './badge.test.svelte';

// @ts-expect-error
import Plus from 'lucide-svelte/icons/plus';

const meta = {
	component: Badge,
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: 'Default',
	args: {
		label: 'Test Badge',
		withDot: false,
	},
};

export const WithIcon: Story = {
	render: () => ({
		Component: Badge,
	}),
	args: {
		startIcon: Plus,
	},
};

export const WithDot: Story = {
	render: () => ({
		Component: Badge,
	}),
	args: {
		withDot: true,
	},
};
