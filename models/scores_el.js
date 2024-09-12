import mongoose, { Schema } from "mongoose";

const ScoresSchema = new Schema(
    {
        user_type: String,
        number_no: Number,
    },
    {
        timestamps: true
    }
);

const Scores = mongoose.models.Scores_el || mongoose.model("Scores_el", ScoresSchema);
export default Scores;
