import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';

import Badge from './badge.test.svelte';

describe('Badge Component', () => {
	const label = 'Test Badge';
	test('should render without errors', () => {
		render(Badge, { label });
		expect(screen.getByText(label)).toBeInTheDocument();
	});
});
