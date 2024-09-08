import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        user_type: {
            type: String,
        },
        role: {
            type: String,
            required: false,
            default: "user"
        },
    },
    { timestamps: true }
)

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;