import resolveConfig from 'tailwindcss/resolveConfig.js'
import tailwindConfig from '../../tailwind.config.cjs'
import * as child from 'child_process';

const config = resolveConfig(tailwindConfig)

const rawColors = config.theme.colors

const excludeColors = [
    'primary',
    'secondary',
    'positive',
    'negative',
    'warning',
    'info'
]
function pbcopy(data) {
    var proc = child.spawn('pbcopy');
    proc.stdin.write(data);
    proc.stdin.end();
}

const colors = Object.entries(rawColors).flatMap(([name, values]) => {
    if (typeof values === 'string' || excludeColors.includes(name)) {
        return []
    }
    return Object.entries(values).map(([tonality, hex]) => ({
        name: `${name}-${tonality}`,
        value: hex
    }))
});


colors.push({ name: 'White', value: '#fff' })
colors.push({ name: 'Black', value: '#000' })

pbcopy(JSON.stringify(colors, null, 2));
console.log('Copied to clipboard');

