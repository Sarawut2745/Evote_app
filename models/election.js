import mongoose, { Schema } from "mongoose";

const ElectionSchema = new Schema(
    {
        name: String,
        personal_ip: Number,
        department: String,
        class_room: String,
        grade: Number,
        img_work: String,
        img_profile: String,
        party_policies: String,
        party_details: String,
        number_no: Number,
    },
    {
        timestamps: true
    }
);

const Election = mongoose.models.Election || mongoose.model("Election", ElectionSchema);
export default Election;
