import Router from "express";
import { CreateQrCode, QrScan, askQuestion } from "../controller/Qr.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";
import { verifyToken } from "../middleware/verifyToken.middlware.js"
const router = Router();

router.route("/createQr").post(verifyToken,verifyAdmin, CreateQrCode);
router.route("/qrScan").post(verifyToken, QrScan);
router.route("/askAi").post(verifyToken,askQuestion);

export default router;