import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/election";
import Scores from "../../../../models/scores_el";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const lastname = formData.get("lastname");
    const personal_ip = formData.get("personal_ip");
    const img_profile = formData.get("img_profile");
    const grade = formData.get("grade");
    const number_no = formData.get("number_no");
    const department = formData.get("department");
    const class_room = formData.get("class_room");
    const party_policies = formData.get("party_policies");
    const party_details = formData.get("party_details");
    const img_work = formData.get("img_work");

    // Check for missing fields
    if (
      !name ||
      !lastname ||
      !personal_ip ||
      !img_profile ||
      !grade ||
      !number_no ||
      !department ||
      !class_room ||
      !party_policies ||
      !party_details ||
      !img_work
    ) {
      return NextResponse.json({ 
        message: "Missing fields", 
        missingFields: {
          name: !name,
          lastname: !lastname,
          personal_ip: !personal_ip,
          img_profile: !img_profile,
          grade: !grade,
          number_no: !number_no,
          department: !department,
          class_room: !class_room,
          party_policies: !party_policies,
          party_details: !party_details,
          img_work: !img_work
        },
        status: 400 
      });
    }

    // Convert numeric fields to numbers
    const personal_ipNumber = Number(personal_ip);
    const gradeNumber = Number(grade);
    const number_noNumber = Number(number_no);

    if (isNaN(personal_ipNumber) || isNaN(gradeNumber) || isNaN(number_noNumber)) {
      return NextResponse.json({ message: "Invalid number format", status: 400 });
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Generate unique filenames using timestamp
    const profileFilename = `P${(Date.now()).toString().padStart(11, "0")}`;
    const workFilename = `W${(Date.now()).toString().padStart(11, "0")}`;

    // Get file extensions
    const profileExt = path.extname(img_profile.name).toLowerCase();
    const workExt = path.extname(img_work.name).toLowerCase();

    // Create full filenames with extensions
    const profileFileWithExt = profileFilename + profileExt;
    const workFileWithExt = workFilename + workExt;

    // Convert image buffers
    const profileBuffer = Buffer.from(await img_profile.arrayBuffer());
    const workBuffer = Buffer.from(await img_work.arrayBuffer());

    // Save profile image
    await writeFile(
      path.join(
        process.cwd(),
        "public/assets/election/profile",
        profileFileWithExt
      ),
      profileBuffer
    );

    // Save work image
    await writeFile(
      path.join(process.cwd(), "public/assets/election/work", workFileWithExt),
      workBuffer
    );

    // Create database entry
    const savedPost = await Post.create({
      name,
      lastname, // Explicitly include lastname
      personal_ip: personal_ipNumber,
      img_profile: profileFileWithExt,
      grade: gradeNumber,
      number_no: number_noNumber,
      department,
      class_room,
      party_policies,
      party_details,
      img_work: workFileWithExt,
    });

    return NextResponse.json({ message: "Success", status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ 
      message: "Failed", 
      error: error.message, 
      status: 500 
    });
  }
}

// GET and DELETE functions remain the same as in the original code
export async function GET() {
  await connectMongoDB();
  const posts = await Post.find({});
  return NextResponse.json({ posts });
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });
    }

    await connectMongoDB();

    // Find the post by ID
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(id);

    // Delete related scores
    await Scores.deleteMany({ number_no: post.number_no });

    // Delete profile image
    const imgProfilePath = path.join(
      process.cwd(),
      "public/assets/election/profile",
      post.img_profile
    );

    // Delete work image
    const imgWorkPath = path.join(
      process.cwd(),
      "public/assets/election/work",
      post.img_work
    );

    // Try to delete profile image file
    try {
      await unlink(imgProfilePath);
      console.log(`Profile image file ${imgProfilePath} deleted successfully`);
    } catch (fileError) {
      console.error(
        `Failed to delete profile image: ${imgProfilePath}`,
        fileError
      );
    }

    // Try to delete work image file
    try {
      await unlink(imgWorkPath);
      console.log(`Work image file ${imgWorkPath} deleted successfully`);
    } catch (fileError) {
      console.error(`Failed to delete work image: ${imgWorkPath}`, fileError);
    }

    return NextResponse.json(
      { message: "Post, related scores, and files deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Failed", status: 500 });
  }
}