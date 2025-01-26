import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
    username: {
        type: String
    },
    fullName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isVerifiedByAdmin: {
        type: String,
        enum: ["rejected", "Verified", "pending"],
        default: "pending"
    }
}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminSchema);