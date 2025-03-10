import mongoose, { Schema } from "mongoose";

const ElectionSchema = new Schema(
    {
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        personal_id: { type: Number, required: true },
        department: { type: String, required: true },
        class_room: { type: String, required: true },
        grade: { type: Number, required: true },
        img_work: { type: String, required: true },
        img_profile: { type: String, required: true },
        party_policies: { type: String, required: true },
        party_details: { type: String, required: true },
        number_no: { type: Number, required: true },
        party_slogan: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

const Election = mongoose.models.Election || mongoose.model("Election", ElectionSchema);
export default Election;
