function drag_context(node: HTMLElement, context: Record<string, string>) {

    const handle_drag = (e: DragEvent) => {
        if (!(e.target instanceof HTMLAnchorElement)) return;
        Object.entries(context).forEach(([key, value]) => {
            e.dataTransfer?.setData(key, value);
        })
    }

    node.addEventListener('dragstart', handle_drag)

    return {
        destroy() {
            node.removeEventListener('dragstart', handle_drag)
        }
    }
}

export default drag_context;