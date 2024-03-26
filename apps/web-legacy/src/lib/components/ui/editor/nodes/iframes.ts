import { Node } from "@tiptap/core";

export interface iFrameOptions {
    addPasteHandler: boolean;
    allowFullscreen: boolean;
    autoplay: boolean;
    ccLanguage?: string;
    ccLoadPolicy?: boolean;
    controls: boolean;
    disableKBcontrols: boolean;
    enableIFrameApi: boolean;
    endTime: number;
    height: string | number;
    interfaceLanguage?: string;
    ivLoadPolicy: number;
    loop: boolean;
    modestBranding: boolean;
    HTMLAttributes: Record<string, any>;
    inline: boolean;
    nocookie: boolean;
    origin: string;
    playlist: string;
    progressBarColor?: string;
    width: string | number;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        iframe: {
            /**
             * Insert an iframe
             */
            setIframe: (options: { src: string }) => ReturnType,
        }
    }
}


export const iframeNode = Node.create<iFrameOptions>({
    name: "iframe",
    // defaultOptions: {
    //     allowFullscreen: true,
    //     HTMLAttributes: {
    //         class: "iframe-wrapper"
    //     }
    // },

    addOptions() {
        return {
            addPasteHandler: true,
            allowFullscreen: true,
            autoplay: false,
            ccLanguage: undefined,
            ccLoadPolicy: undefined,
            controls: false,
            disableKBcontrols: false,
            enableIFrameApi: false,
            endTime: 0,
            height: '100%',
            interfaceLanguage: undefined,
            ivLoadPolicy: 0,
            loop: false,
            modestBranding: false,
            HTMLAttributes: {},
            inline: false,
            nocookie: false,
            origin: '',
            playlist: '',
            progressBarColor: undefined,
            width: '100%',
        }
    },


    group() {
        return this.options.inline ? 'inline' : 'block'
    },

    inline() {
        return this.options.inline
    },

    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            frameborder: {
                default: 0,
            },
            allowfullscreen: {
                default: this.options.allowFullscreen,
                parseHTML: () => this.options.allowFullscreen,
            },
            width: {
                default: this.options.width,
            },
            height: {
                default: this.options.height,
            },
            'data-type': {
                default: 'iframe',
            },
        }
    },
    parseHTML() {
        return [{
            tag: "iframe",
        }]
    },
    renderHTML({ HTMLAttributes }) {
        return ["div", this.options.HTMLAttributes, ["iframe", HTMLAttributes]]
    },
    addCommands() {
        return {
            setIframe: (options) => ({ tr, dispatch }) => {
                const { selection } = tr
                const node = this.type.create(options)

                if (dispatch) {
                    tr.replaceRangeWith(selection.from, selection.to, node)
                }

                return true
            },
        }
    },
})