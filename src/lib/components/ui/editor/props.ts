// import { handleImageUpload } from "@/lib/editor";
import type { EditorProps } from "@tiptap/pm/view";
import { handleImageUplaod } from "./utils";

export const TiptapEditorProps: EditorProps = {
    attributes: {
        class: `prose data-[size=lg]:prose-lg prose-headings:font-display font-default focus:outline-none max-w-full`,
    },
    handleDOMEvents: {
        keydown: (_view, event) => {
            // prevent default event listeners from firing when slash command is active
            if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
                const slashCommand = document.querySelector("#slash-command");
                if (slashCommand) {
                    return true;
                }
            }
        },
    },
    handlePaste: (view, event) => {
        if (
            event.clipboardData &&
            event.clipboardData.files &&
            event.clipboardData.files[0]
        ) {
            event.preventDefault();
            const file = event.clipboardData.files[0];
            // TODO
            return handleImageUplaod(file, view, event);
        }
        return false;
    },
    handleDrop: (view, event, _slice, moved) => {
        if (
            !moved &&
            event.dataTransfer &&
            event.dataTransfer.files &&
            event.dataTransfer.files[0]
        ) {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            // TODO
            return handleImageUplaod(file, view, event);
        }
        return false;
    },
};
