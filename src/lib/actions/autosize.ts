import autosize from 'autosize';

export default (node: HTMLElement) => {
    autosize(node);
    return {
        destroy() {
            autosize.destroy(node);
        },
    };
};