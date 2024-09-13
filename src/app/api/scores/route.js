import { connectMongoDB } from "../../../../lib/mongodb";
import Scores from "../../../../models/scores_el";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();

  // Aggregation pipeline to count occurrences of every number_no
  const counts = await Scores.aggregate([
    {
      $group: {
        _id: "$number_no",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        number_no: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        count: -1, // Optional: sort by count in descending order
      },
    },
  ]);

  return NextResponse.json({ counts });
}
