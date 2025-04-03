import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Properly parse JSON body
    const { file } = body as { file: string }; // Expecting a Base64-encoded string
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Upload the Base64 image to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(file, {
      folder: 'uploads',
    });

    return NextResponse.json({ url: uploadedResponse.secure_url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
