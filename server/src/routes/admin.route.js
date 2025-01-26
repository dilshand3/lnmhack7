import { Router } from "express";
import { signUpAdmin, loginAdmin, getUser, logOutAdmin } from "../controller/admin.controller.js";
import { verifyToken } from "../middleware/verifyToken.middlware.js";

const router = Router();

router.route("/signup").post(signUpAdmin);
router.route("/login").post(loginAdmin);
router.route("/getAdmin").get(verifyToken, getUser);
router.route("/logoutAdmin").get(verifyToken, logOutAdmin);

export default router;