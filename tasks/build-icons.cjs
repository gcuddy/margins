const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');
const args = process.argv.slice(2);
const src = args[0];
const append = args[1];
if (!src) {
	console.error('Missing src argument');
	process.exit(1);
}
const camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase());
function pbcopy(data) {
	var proc = require('child_process').spawn('pbcopy');
	proc.stdin.write(data);
	proc.stdin.end();
}
const icons = {};
fs.readdirSync(src).forEach((file) => {
	const html = parse(fs.readFileSync(`${src}/${file}`, 'utf8'));

	const svg = html.querySelector('svg');
	if (!svg) return;

	const box = svg.attributes.viewBox.split(' ')[2];
	icons[camelize(path.basename(file, '.svg') + append)] = {
		box,
		svg: svg.innerHTML.trim(),
	};
});
pbcopy(JSON.stringify(icons, null, 2));
console.log('Copied to clipboard');
