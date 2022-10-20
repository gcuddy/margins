export function objectToFormEntries(source = {}, parentKey = null, entries = []) {
    for (let [key, value] of Object.entries(source)) {
        append(entries, composeKey(parentKey, key), value);
    }
    return entries;
}
function composeKey(parent, key) {
    return parent ? parent + "[" + key + "]" : key;
}
function append(entries, key, value) {
    if (Array.isArray(value)) {
        for (let [subkey, subvalue] of value.entries()) {
            append(entries, composeKey(key, subkey.toString()), subvalue);
        }
    }
    else if (value instanceof Date) {
        entries.push([key, value.toISOString()]);
    }
    else if (typeof value === "boolean") {
        entries.push([key, value ? "1" : "0"]);
    }
    else if (typeof value === "string") {
        entries.push([key, value]);
    }
    else if (typeof value === "number") {
        entries.push([key, `${value}`]);
    }
    else if (value === null || value === undefined) {
        entries.push([key, ""]);
    }
    else {
        objectToFormEntries(value, key, entries);
    }
}
