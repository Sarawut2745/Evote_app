import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        user_type: String,
        number_no: Number,
    },
    {
        timestamps: true
    }
);

const Post = mongoose.models.Scores_el || mongoose.model("Scores_el", postSchema);
export default Post;
