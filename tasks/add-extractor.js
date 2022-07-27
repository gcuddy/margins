import fs from 'fs';

const camelCase = (str) => str.trim().replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));

const args = process.argv.slice(2);
const urlArg = args[0];

// add a url, and we will parse it

if (!urlArg) {
	console.error('Missing url argument');
	process.exit(1);
}
const { hostname } = new URL(urlArg);
const extractors_path = `./src/lib/web-parser/extractors`;
const dest = `${extractors_path}/${hostname}`;
if (fs.existsSync(dest)) {
	console.log(`Extractor for ${hostname} already exists`);
	process.exit(1);
}

fs.mkdirSync(dest);
fs.writeFileSync(
	`${dest}/index.ts`,
	`import type { CustomExtractor } from '$lib/web-parser';

export const ${camelCase(hostname)}: CustomExtractor = {
	domain: '${hostname}',
}`
);
fs.appendFileSync(`${extractors_path}/index.ts`, `\nexport * from './${hostname}';`);
console.log(`Created extractor for ${hostname}!`);
