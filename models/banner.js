import mongoose, { Schema } from "mongoose";

const BannerSchema = new Schema(
    {
        image: {
            type: String,
        },
    },
    { timestamps: true }
)

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
export default Banner;