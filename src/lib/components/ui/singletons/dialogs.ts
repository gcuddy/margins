import { formatTimeDuration } from "$lib/utils/dates";
import Button from "../Button.svelte";
import Textarea from "../Textarea.svelte";
import { dialog_store } from "./Dialog.svelte";

export function useTimeStampNote(timestamp: number, cb: (body: string) => void) {
    let body = '';
    // no idea why eslint is complaining about this
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    dialog_store.open({
        title: 'Take note',
        description: `Timestamp: <span class="font-medium text-muted-foreground">${formatTimeDuration(timestamp, 'seconds')}</span>`,
        content: {
            component: Textarea,
            props: {
                onInput: (value) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    body = value;
                }
            }
        },
        footer: {
            component: Button,
            props: {
                text: "Save",
                onClick: () => {
                    cb(body);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    dialog_store.close();
                }
            },
        }
    })
}