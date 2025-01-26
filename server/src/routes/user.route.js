import { Router } from "express";
import { getUser, login, signUp, logOut } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.middlware.js";
const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/getUser").get(verifyToken, getUser);
router.route("/logout").get(logOut);

export default router;