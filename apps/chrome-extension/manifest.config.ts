import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';

const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
	// can only contain digits, dots, or dash
	.replaceAll(/[^\d.-]+/g, '')
	// split into version parts
	.split(/[.-]/);

export default defineManifest(async (env) => ({
	action: {
		default_popup: 'src/popup/index.html',
	},
	background: {
		service_worker: 'src/background.ts',
		type: 'module',
	},
	manifest_version: 3,
	name: env.mode === 'staging' ? '[INTERNAL] Margins' : 'Margins',
	permissions: ['storage', 'tabs'],
	// up to four numbers separated by dots
	version: `${major}.${minor}.${patch}.${label}`,
	// semver is OK in "version_name"
	version_name: version,
}));
