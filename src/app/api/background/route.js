// route.js
import { connectMongoDB } from "../../../../lib/mongodb";
import Banner from "../../../../models/banner";
import { NextResponse } from "next/server";
import path from "path";
import { unlink, writeFile } from "fs/promises";

let cachedDb = null;

async function getDbConnection() {
  if (cachedDb) {
    return cachedDb;
  }
  cachedDb = await connectMongoDB();
  return cachedDb;
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export async function GET() {
  try {
    await getDbConnection();
    const background = await Banner.find({})
      .lean()
      .select('image _id') // Make sure to include _id
      .exec();
    
    return NextResponse.json({ background });
  } catch (error) {
    console.error("Error fetching Banner:", error);
    return NextResponse.json({ error: "Failed to fetch Banner" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const images = formData.getAll("images");

    if (!images?.length) {
      return NextResponse.json({ error: "No images uploaded" }, { status: 400 });
    }

    await getDbConnection();

    const processImage = async (image) => {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${Math.random().toString(36).slice(2)}${path.extname(image.name)}`;
      const filePath = `/assets/banner/${fileName}`;
      const fullPath = path.join(process.cwd(), "public", filePath);

      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      await Promise.all([
        writeFile(fullPath, buffer),
        Banner.create({ image: filePath })
      ]);

      return filePath;
    };

    const savedPaths = await Promise.all(images.map(processImage));

    return NextResponse.json(
      { message: "Images uploaded successfully", paths: savedPaths },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID not provided" }, { status: 400 });
    }

    await getDbConnection();
    
    const banner = await Banner.findOneAndDelete({ _id: id });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public", banner.image);
    unlink(filePath).catch(error => 
      console.error("Error deleting file:", error)
    );

    return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Banner:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

