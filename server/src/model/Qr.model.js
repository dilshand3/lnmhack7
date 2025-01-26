import mongoose, { Schema } from "mongoose";

const QrCodeSchema = new Schema({
    QrImg: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const QrCode = mongoose.model("QrCode", QrCodeSchema);