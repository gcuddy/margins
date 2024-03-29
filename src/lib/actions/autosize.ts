import autosizefn from 'autosize';

const autosize = (node: HTMLElement) => {
    autosizefn(node);
    console.log({ autosizefn })

    return {
        destroy() {
            autosizefn.destroy(node);
        },
    };
};

autosize.update = autosizefn.update;
autosize.destroy = autosizefn.destroy;

export default autosize;
