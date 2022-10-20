export function contains(containers, element) {
    for (let container of containers) {
        if (container.contains(element))
            return true;
    }
    return false;
}
