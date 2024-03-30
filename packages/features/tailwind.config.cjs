const base = require('@margins/config/tailwind-preset');

module.exports = {
	...base,
	content: [...base.content, '/**/*.{js,ts,jsx,tsx,svelte}'],
};
