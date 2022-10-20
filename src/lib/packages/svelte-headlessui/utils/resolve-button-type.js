export function resolveButtonType(props, ref) {
    if (props.type)
        return props.type;
    let tag = props.as ?? "button";
    if (typeof tag === "string" && tag.toLowerCase() === "button")
        return "button";
    if (ref && ref instanceof HTMLButtonElement)
        return "button";
    return undefined;
}
