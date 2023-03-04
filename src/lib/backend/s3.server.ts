import { CLOUDFLARE_ID, S3_ID, S3_SECRET } from "$env/static/private";
import {
    S3Client,
    ListBucketsCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
    PutObjectRequest,
    HeadObjectCommand
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

// upload file
export async function uploadFile({
    Key,
    Body
}: {
    Key: string;
    Body: PutObjectRequest["Body"];
}) {
    try {
        const data = await s3.send(new PutObjectCommand({
            Key,
            Body,
            Bucket: PUBLIC_BUCKET
        }))

        return data;
    } catch (e) {
        console.error(e)
    }
}
