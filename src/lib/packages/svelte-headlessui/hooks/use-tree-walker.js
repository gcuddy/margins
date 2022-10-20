export function treeWalker({ container, accept, walk, enabled, }) {
    let root = container;
    if (!root)
        return;
    if (enabled !== undefined && !enabled)
        return;
    let acceptNode = Object.assign((node) => accept(node), {
        acceptNode: accept,
    });
    let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, acceptNode, 
    // @ts-ignore-error Typescript bug thinks this can only have 3 args
    false);
    while (walker.nextNode())
        walk(walker.currentNode);
}
