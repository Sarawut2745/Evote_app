import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Scores from '../../../../models/scores_el';
import User from '../../../../models/user';

export async function POST(req) {
  try {
    const { user_type, number_no } = await req.json();

    console.log(number_no)

    await connectMongoDB();
    await Scores.create({ user_type, number_no });

    return NextResponse.json({ message: 'Scores added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error while adding score:', error);
    return NextResponse.json({ message: 'An error occurred while adding the score' }, { status: 500 });
  }
}

export async function GET() {
  await connectMongoDB();
  const user = await User.find({});
  return NextResponse.json({ user });
}