import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    ScanMedicineData: [
        {
            name: String,
            mfgDate: String,
            expDate: String,
            price: Number,
            notificationSend: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);