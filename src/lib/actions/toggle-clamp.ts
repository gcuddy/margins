export default function toggle_clamp(node: HTMLElement) {
    let is_clamped = node.scrollHeight > node.clientHeight;
    console.log({ node })
    const clamp_class = Array.from(node.classList).find((c) => c.startsWith('line-clamp-'));

    console.log({ is_clamped, clamp_class })

    let button: HTMLButtonElement | null = null;

    function toggle_clamp() {
        if (!clamp_class || !button) return;
        node.classList.toggle(clamp_class);
        if (button) {
            if (node.classList.contains(clamp_class)) {
                button.innerHTML = 'Show more';
            } else {
                button.innerHTML = 'Show less';
            }
        }
    }

    function setup() {
        if (is_clamped && clamp_class) {
            button = document.createElement('button');
            button.classList.add('clamp-toggle');
            button.innerHTML = 'Show more';
            // find tailwind clamp class (e.g. line-clamp-X)
            button.addEventListener('click', toggle_clamp);
            node.parentNode?.insertBefore(button, node.nextSibling);
        }
    }
    setup();


    return {
        destroy() {
            if (button) {
                button.removeEventListener('click', toggle_clamp);
            }
        },
        update() {
            console.log({ node })
            is_clamped = node.scrollHeight > node.clientHeight;
            setup();
        }
    };
}