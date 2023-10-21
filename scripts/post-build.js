#!/usr/bin/env node
import * as fs from 'fs';
import ts from 'typescript';

// heavily influenced from https://github.com/skeletonlabs/skeleton/blob/db6aef51a9834209101ab16817e48c33927bb1df/scripts/post-build.js#L13

let props_as_classes = []
const slotprop_regex = /export let (\w+): SlotProp/gm;

/**
 * 
 * @param {string} dir 
 */
function extract_slotprops_from_components(dir) {
    const list = fs.readdirSync(dir);

    // walk through and get .svelte files
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            extract_slotprops_from_components(file);
        } else if (file.endsWith('.svelte')) {
            const src = fs.readFileSync(file, 'utf8');
            // pray that this works lol — *very* hacky
            // find all exported props that follow this pattern:
            // export let propname: SlotProp
            // then add them to the list of props
            if (src.includes("SlotProp")) {
                Array.from(src.matchAll(slotprop_regex)).forEach(match => {
                    props_as_classes.push(match[1])
                })
            }

        }
    })
}

function generate_keywords() {
    let props = Array.from(new Set(props_as_classes)).sort();
    props.unshift(...['class', 'className'])
    // read workspace .vscode/settings.json
    const settings = JSON.parse(fs.readFileSync('.vscode/settings.json', 'utf8'));
    // add tailwindCSS.classAttributes to the list of props
    settings['tailwindCSS.classAttributes'] = [...props];
    // write back to .vscode/settings.json
    fs.writeFileSync('.vscode/settings.json', JSON.stringify(settings, null, '\t'));
}

extract_slotprops_from_components('./src/lib');
extract_slotprops_from_components('./src/routes');
generate_keywords();