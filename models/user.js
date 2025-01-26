import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        posonal_number: {
            type: String,  // Ensure the field type is correct
            required: true  // Make sure it's required if that's the case
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