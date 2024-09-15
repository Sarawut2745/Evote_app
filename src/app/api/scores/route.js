import { connectMongoDB } from "../../../../lib/mongodb";
import Scores from "../../../../models/scores_el";
import { NextResponse } from 'next/server';

export async function GET() {
  await connectMongoDB();

  // Aggregate counts by user_type
  const userTypeCounts = await Scores.aggregate([
    { $group: { _id: "$user_type", count: { $sum: 1 } } },
    { $project: { _id: 0, user_type: "$_id", count: 1 } }
  ]);

  // Aggregate counts by number_no
  const numberNoCounts = await Scores.aggregate([
    { $group: { _id: "$number_no", count: { $sum: 1 } } },
    { $project: { _id: 0, number_no: "$_id", count: 1 } }
  ]);

  // Total document count
  const totalDocumentCount = await Scores.countDocuments();

  return NextResponse.json({
    userTypeCounts,
    numberNoCounts,
    totalDocumentCount,  // Return the total document count
  });
}
