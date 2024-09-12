import mongoose, { Schema } from "mongoose";

const ElectionSchema = new Schema(
    {
        title: String,
        img: String,
        number_no: Number,
    },
    {
        timestamps: true
    }
);

const Election = mongoose.models.Election || mongoose.model("Election", ElectionSchema);
export default Election;
