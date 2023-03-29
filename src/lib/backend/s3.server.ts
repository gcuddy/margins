import { CLOUDFLARE_ID, S3_ID, S3_SECRET } from "$env/static/private";
import {
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
        const data = await s3.send(new PutObjectCommand({
            Bucket: PUBLIC_BUCKET,
            ...input
        }))
        return data;
    } catch (e) {
        console.error(e)
    }
}
