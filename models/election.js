import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        title: String,
        img: String,
        content: String,
    },
    {
        timestamps: true
    }
)

const Post = mongoose.models.Election || mongoose.model("Election", postSchema);
export default Post;