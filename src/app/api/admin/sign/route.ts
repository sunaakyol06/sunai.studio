import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { signUpload, cloudinaryReady } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const authed = await isAuthed();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!cloudinaryReady) {
      return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 400 });
    }

    const body = await request.json();
    const { publicId } = body;
    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureDetails = signUpload(publicId, timestamp);

    return NextResponse.json({
      timestamp,
      signature: signatureDetails.signature,
      apiKey: signatureDetails.apiKey,
      cloudName: signatureDetails.cloudName,
    });
  } catch (error) {
    console.error("Sign API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
