import path from "path";
import fs from "fs";
import QRCode from "qrcode";
import sharp from "sharp";
import Gemini from "gemini-ai";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { QrCode } from "../model/Qr.model.js";
import { User } from "../model/user.model.js";

const gemini = new Gemini(process.env.GEMINIAPI_KEY);

const ensureQrFolderExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const generateQRCodeWithLogo = async (data, logoPath, outputPath) => {
    try {
        ensureQrFolderExists(path.dirname(outputPath));
        const qrCodeData = await QRCode.toBuffer(data);
        const logo = await sharp(logoPath).resize(40).toBuffer();
        await sharp(qrCodeData).composite([{ input: logo, gravity: "center" }]).toFile(outputPath);
        return outputPath;
    } catch (error) {
        throw error;
    }
};

const CreateQrCode = async (req, res) => {
    const { name, mfgDate, expDate, price } = req.body;
    console.log(req.body)
    try {
        if (!name || !mfgDate || !expDate || !price) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const medicineData = { name, mfgDate, expDate, price };
        const logoPath = path.resolve("public", "logo.jpg");
        const outputPath = path.resolve("public", "temp", `${name}-${Date.now()}.png`);

        const qrCodePath = await generateQRCodeWithLogo(
            JSON.stringify(medicineData),
            logoPath,
            outputPath
        );

        const qrCodeUrl = await uploadOnCloudinary(qrCodePath);

        if (qrCodeUrl) {
            const newMedicine = await QrCode.create({
                QrImg: qrCodeUrl,
            });

            res.status(200).json({
                success: true,
                message: "QR code generated and uploaded successfully",
                data: qrCodeUrl,
            });
        } else {
            res.status(500).json({ success: false, message: "Error uploading to Cloudinary" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error generating or uploading QR code" });
    }
};

const QrScan = async (req, res) => {
    const { name, mfgDate, expDate, price } = req.body;
    const userId = req.userId;
    console.log(req.body);
    try {
        if (!name || !mfgDate || !expDate || !price) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    ScanMedicineData: [
                        {
                            name,
                            mfgDate,
                            expDate,
                            price,
                            notificationSend: false,
                        },
                    ],
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const exchangeLine = `The product you scanned is ${name}. Its Manufacturing Date is ${mfgDate}, and its Expiry Date is ${expDate}. The Price of the product is ${price} in INR. If you have any questions related to this product, feel free to ask!`;

        res.status(200).json({
            success: true,
            message: "QR data saved successfully",
            data: exchangeLine,
        });
    } catch (error) {
        console.log(`this is ${error}`)
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const askQuestion = async (req, res) => {
    const { text } = req.body;
    const userId = req.userId;
    console.log(req.body)
    try {
        const user = await User.findById(userId);
        if (!user || user.ScanMedicineData.length === 0) {
            return res.status(404).json({ success: false, message: "No scanned data found" });
        }

        const qrData = user.ScanMedicineData[0];

        const geminiResponse = await gemini.ask(
            `keep your reply in on 1-3 line and dont send anything extra,dont send anythinHere is the product data: Name: ${qrData.name}, Manufacturing Date: ${qrData.mfgDate}, Expiry Date: ${qrData.expDate}, Price: ${qrData.price} in INR. Now answer this: ${text} as your knolegez`
        );

        res.status(200).json({
            success: true,
            message: "Answer generated successfully",
            data: geminiResponse,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export { CreateQrCode, QrScan, askQuestion };
