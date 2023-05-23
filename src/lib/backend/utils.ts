import { nanoid } from "$lib/nanoid";
import type { RequestEvent } from "@sveltejs/kit";
import { uploadFile } from "./s3.server";

export async function generateKeyFromUrl(url: string, ext?: string, path = "") {
    const u = new URL(url)
    u.search = "";
    const cleanedUrl = u.toString();
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(cleanedUrl));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    const Key = path + `${hashHex}${ext ? "." + ext : ""}`
    return Key;
}

export async function upload_file_from_form({ request, locals, session: sesh }: RequestEvent & {
    session?: {
        userId: string
    }
}, params?: Omit<Parameters<typeof uploadFile>[0], "Body" | "Key">) {

    const session = sesh ?? (await locals.validate());
    if (!session) {
        throw new Error("Not logged in")
    }
    const data = await request.formData();
    const file = data.get("file") as Blob;
    console.log({ file });
    if (!file) {
        throw new Error("No file")
    }
    const ext = file.type.split("/")[1];
    const id = nanoid();
    const Key = `assets/${session.userId}/${id}.${ext}`
    const buf = Buffer.from(await file.arrayBuffer());
    const uploaded_file = await uploadFile({
        Body: buf,
        Key,
        ...params
    })
    console.log({ uploaded_file })
    return { Key, fileName: file.name, file };
}