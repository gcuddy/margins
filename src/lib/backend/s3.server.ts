import { CLOUDFLARE_ID, S3_ID, S3_SECRET } from "$env/static/private";
import { generateKeyFromUrl } from "$lib/backend/utils";
import {
    HeadObjectCommand,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectRequest,
    S3Client
} from "@aws-sdk/client-s3";


export const s3 = new S3Client({
    endpoint: `https://${CLOUDFLARE_ID}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
        accessKeyId: S3_ID,
        secretAccessKey: S3_SECRET
    }
});

const PUBLIC_BUCKET = 'margins';

type Input = Omit<PutObjectCommandInput, "Bucket"> & {
    Key: string;
}


// upload file
export async function uploadFile(input: Input) {
    try {
        console.log({ input })
        const data = await s3.send(new PutObjectCommand({
            Bucket: PUBLIC_BUCKET,
            ACL: "public-read",
            ...input
        }))
        console.log({ data })
        return data;
    } catch (e) {
        console.error(e)
    }
}


export async function fetchAndUploadImage(imageUrl: string, opts?: { key?: string, path?: `${string}/` }) {
    const { key, path = "images/" } = opts ?? {};
    const url = new URL(imageUrl);
    url.search = "";
    const cleanedUrl = url.toString();
    console.log({ cleanedUrl })
    const res = await fetch(cleanedUrl);
    const ContentType = res.headers.get("content-type") || res.headers.get("Content-Type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const Key = key || await generateKeyFromUrl(cleanedUrl, ContentType.split("/")[1], path)
    console.log(`fetchAndUploadImage: ${Key}`)
    await uploadFile({
        Key,
        Body: buffer,
        ContentType
    });
    return Key;
}

export const CDN = "https://margins.b-cdn.net/";

const reasonable_image_extensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "bmp",
    "tiff",
    "tif",
]

export async function upsertImageUrl(url: string, key?: string) {
    const u = new URL(url);
    u.search = "";
    u.hash = "";
    const _src = u.toString();
    const ext = _src.split(".").pop();
    const Key = key ?? await generateKeyFromUrl(_src, ext)
    // check if already exists
    const exists = !!await s3.send(new HeadObjectCommand({
        Key,
        Bucket: "margins",
    })).catch(e => {
        if (e.name === "NotFound") {
            return false;
        }
        throw e;
    });
    console.log({ exists })
    if (exists) {
        const newSrc = CDN + Key;
        return newSrc;
    }
    // else go fetch it and upload it
    const newKey = await fetchAndUploadImage(_src, {
        key: ext && reasonable_image_extensions.includes(ext) ? Key : undefined
    })
    const newSrc = CDN + key || newKey;
    return newSrc;
}
