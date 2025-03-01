import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    posonal_number: { type: String, required: true, unique: true },
    user_type: { type: String, required: true },
    vote_status: { type: Number, required: true }, // เปลี่ยนเป็น required
    role: { type: String, default: "user" },
}, { timestamps: true });

// ล้างโมเดลเดิมออกก่อนถ้ามีการกำหนดไว้แล้ว
mongoose.models = {};

const User = mongoose.model("User", userSchema);
export default User;