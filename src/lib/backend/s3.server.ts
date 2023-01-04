import { CLOUDFLARE_ID, S3_ID, S3_SECRET } from "$env/static/private";
import S3 from 'aws-sdk/clients/s3.js';

const s3 = new S3({
    endpoint: `https://${CLOUDFLARE_ID}.r2.cloudflarestorage.com`,
    accessKeyId: S3_ID,
    secretAccessKey: S3_SECRET,
    signatureVersion: 'v4',
});

const PUBLIC_BUCKET = 'margins';

// upload file
export async function uploadFile({
    Key,
    Body
}: {
    Key: string;
    Body: S3.Body;
}) {
    return s3.upload({
        Key,
        Body,
        Bucket: PUBLIC_BUCKET
    })
}