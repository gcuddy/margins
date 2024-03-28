import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'cd apps/web && bun run dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		// command: 'npm run build && npm run preview',
		// port: 4173,
		// timeout: 120 * 1000,
	},
	use: {
		baseURL: 'http://localhost:5173',
	},
	testMatch: '**/*.spec.ts',
};

export default config;
