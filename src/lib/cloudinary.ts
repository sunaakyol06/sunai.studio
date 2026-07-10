import { v2 as cloudinary } from "cloudinary";
import "server-only";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const cloudinaryReady = !!(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

export function slugify(text: string): string {
  const turkishChars: Record<string, string> = {
    "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
    "Ç": "c", "Ğ": "g", "İ": "i", "Ö": "o", "Ş": "s", "Ü": "u"
  };
  
  let formatted = text;
  Object.keys(turkishChars).forEach((char) => {
    formatted = formatted.replace(new RegExp(char, "g"), turkishChars[char]);
  });

  return formatted
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function signUpload(publicId: string, timestamp: number) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) throw new Error("Cloudinary API secret is not configured");

  const signature = cloudinary.utils.api_sign_request(
    {
      public_id: publicId,
      timestamp: timestamp,
    },
    apiSecret
  );

  return {
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}

export function getClosestRatio(width: number, height: number): "9:16" | "1:1" | "4:5" | "3:4" | "16:9" {
  const ratio = width / height;
  const targets = [
    { name: "9:16", val: 9 / 16 },
    { name: "3:4", val: 3 / 4 },
    { name: "4:5", val: 4 / 5 },
    { name: "1:1", val: 1 / 1 },
    { name: "16:9", val: 16 / 9 }
  ] as const;

  let closest: typeof targets[number] = targets[0];
  let minDiff = Math.abs(ratio - closest.val);

  for (let i = 1; i < targets.length; i++) {
    const diff = Math.abs(ratio - targets[i].val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = targets[i];
    }
  }

  return closest.name;
}
