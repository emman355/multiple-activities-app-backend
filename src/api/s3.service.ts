import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";
import { supabaseAdmin } from "../config/supabase.js";


export const s3 = new S3Client({
  region: "ap-southeast-2", // arbitrary
  endpoint: env.SUPABASE_S3_ENDPOINT, // e.g. https://<project-ref>.supabase.co/storage/v1/s3
  credentials: {
    accessKeyId: env.SUPABASE_S3_ACCESS_KEY!,
    secretAccessKey: env.SUPABASE_S3_SECRET_KEY!,
  },
});

export async function uploadFile(
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage.from(bucket).upload(key, body, {
    contentType,
    upsert: true, // ✅ overwrite if file exists
  });

  if (error) {
    throw new Error("UploadError: " + error.message);
  }

  return `${env.SUPABASE_S3_PUBLIC_URL}/${bucket}/${data.path}`; // ✅ public URL
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
  if (error) throw error;
}